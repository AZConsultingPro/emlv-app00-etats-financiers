'use strict';
(function (root) {
  const VERSION='1.0.0', KEY='emlv-app00-carnet-v1';
  const fresh=()=>({version:VERSION,answers:{},points:{},quiz:{run:1,history:[]},
    challenge:{round:1,index:0,streak:0,best:0},resume:'cours/orienter',note:'',checklist:[]});
  const entry=()=>({draft:'',checked:'',errors:0,solved:false,revealed:false});
  const response=(book,key)=>book.answers[key]||entry();

  function parseNumeric(raw) {
    const text=raw.trim().replace(/[−–]/g,'-').replace(/\s*(?:€|euros?)$/i,'').trim();
    if (!text) return {error:'Saisissez un montant. Une case vide est différente de zéro.'};
    if (!/^[+-]?(?:\d+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)(?:[.,]\d+)?$/.test(text)) {
      return {error:'Saisissez un montant en euros, par exemple 1 250,00 ou -250. Utilisez des espaces pour les milliers.'};
    }
    const number=Number(text.replace(/[ \u00a0\u202f]/g,'').replace(',','.'));
    return Number.isFinite(number)?{number}:{error:'Le montant est trop grand.'};
  }

  function grade(question,raw) {
    if (question.options) {
      return /^[0-3]$/.test(raw)?{correct:Number(raw)===question.answer}:{error:'Choisissez une réponse.'};
    }
    const parsed=parseNumeric(raw);
    return parsed.error?parsed:{correct:parsed.number===question.answer};
  }

  function edit(book,key,draft) {
    const old=response(book,key);
    if (old.draft===draft) return false;
    book.answers[key]={...old,draft,checked:'',solved:false};
    return true;
  }

  function check(book,key,question,mode) {
    const old=response(book,key);
    if ((mode==='quiz'||mode==='challenge')&&old.checked || mode==='practice'&&old.revealed) return {repeat:true};
    const result=grade(question,old.draft);
    if (result.error) return result;
    if (old.checked===old.draft) return {repeat:true};
    const next={...old,checked:old.draft,solved:result.correct};
    if (result.correct) book.points[key]=true;
    else next.errors++;
    if (mode==='practice'&&next.errors>=3) next.revealed=true;
    book.answers[key]=next;
    if (mode==='challenge') {
      const challenge=book.challenge;
      challenge.streak=result.correct?challenge.streak+1:0;
      challenge.best=Math.max(challenge.streak,challenge.best);
    }
    return result;
  }

  const keyFor=(book,q,mode)=>mode==='quiz'?'q'+book.quiz.run+'-'+q.id:
    mode==='challenge'?'d'+book.challenge.round+'-'+q.id:q.id;
  const transferRequired=(book,id)=>id==='croiser'||response(book,'p-'+id).revealed;
  function consolidated(book,id) {
    const practice=response(book,'p-'+id);
    return (practice.solved||practice.revealed)&&(!transferRequired(book,id)||response(book,'t-'+id).solved);
  }
  function quizStats(book,questions) {
    const states=questions.map(q=>response(book,keyFor(book,q,'quiz')));
    const done=states.filter(state=>state.checked).length;
    return {done,score:states.filter(state=>state.solved).length,complete:done===questions.length};
  }
  function nextQuiz(book,questions) {
    const stats=quizStats(book,questions);
    if (!stats.complete) return false;
    book.quiz.history.push(stats.score);
    book.quiz.run++;
    return true;
  }

  function validatedBook(data,content,routes) {
    if (!data||data.version!==VERSION||!data.answers||!data.points||!data.quiz||!data.challenge) return null;
    const integer=(value,max)=>Number.isInteger(value)&&value>=0&&value<=max;
    const bank=new Map([...content.practice,...content.transfers].map(q=>[q.id,q]));
    const quizBank=new Map(content.quiz.map(q=>[q.id,q]));
    const challengeBank=new Map(content.challenge.map(q=>[q.id,q]));
    const getQuestion=key=>{
      const quiz=key.match(/^q([1-9]\d*)-(q-[a-z]+)$/);
      const challenge=key.match(/^d([1-9]\d*)-(d\d+)$/);
      if (quiz&&Number(quiz[1])<=data.quiz.run) return quizBank.get(quiz[2]);
      if (challenge&&Number(challenge[1])<=data.challenge.round) return challengeBank.get(challenge[2]);
      return bank.get(key);
    };
    if (!integer(data.quiz.run,10000)||data.quiz.run<1||!Array.isArray(data.quiz.history)||
        data.quiz.history.length!==data.quiz.run-1||!data.quiz.history.every(value=>integer(value,content.quiz.length))) return null;
    const c=data.challenge;
    if (!integer(c.round,10000)||c.round<1||!integer(c.index,content.challenge.length)||
        !integer(c.streak,content.challenge.length)||!integer(c.best,content.challenge.length)||c.streak>c.best) return null;
    if (!routes.has(data.resume)||typeof data.note!=='string'||data.note.length>2400||
        !Array.isArray(data.checklist)||new Set(data.checklist).size!==data.checklist.length||
        !data.checklist.every(value=>integer(value,3))) return null;
    if (Array.isArray(data.answers)||Array.isArray(data.points)||typeof data.answers!=='object'||typeof data.points!=='object') return null;
    for (const [key,state] of Object.entries(data.answers)) {
      const q=getQuestion(key);
      if (!q||!state||typeof state.draft!=='string'||state.draft.length>120||typeof state.checked!=='string'||
          state.checked.length>120||typeof state.solved!=='boolean'||typeof state.revealed!=='boolean'||!integer(state.errors,10000)) return null;
      if (state.checked&&(state.checked!==state.draft||grade(q,state.checked).correct!==state.solved)) return null;
      if (!state.checked&&state.solved) return null;
      if (state.revealed!==(key.startsWith('p-')&&state.errors>=3)) return null;
      if (state.solved&&data.points[key]!==true) return null;
    }
    for (const [key,point] of Object.entries(data.points)) {
      if (!getQuestion(key)||point!==true||!Object.hasOwn(data.answers,key)) return null;
    }
    return data;
  }
  root.EMLVModel={VERSION,KEY,fresh,response,parseNumeric,grade,edit,check,keyFor,quizStats,nextQuiz,transferRequired,consolidated,validatedBook};
})(typeof module==='object'?module.exports:window);
