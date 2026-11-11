'use strict';
(() => {
  const C=window.EMLVContent, M=window.EMLVModel;
  const main=document.querySelector('main');
  const dialog=document.querySelector('#definition');
  const banner=document.querySelector('#notice');
  const evaluations=window.EMLVEvaluations||{};
  const questions=[...C.practice,...C.transfers,...C.quiz,...C.challenge];
  const routes=new Set(['accueil','lexique','defi','quiz','synthese','carnet',...C.blocks.flatMap(b=>['cours/'+b.id,'activite/'+b.id])]);
  const dst='https://azconsultingpro.github.io/emlv-chapitre1-prepa-dst/';
  const courses=[
    ['S1 · Le bilan','https://azconsultingpro.github.io/emlv-app1-bilan/'],
    ['S2 · Le compte de résultat','https://azconsultingpro.github.io/emlv-app2-compte-resultat/'],
    ['S3 · Les flux de trésorerie','https://azconsultingpro.github.io/emlv-app3-flux-tresorerie/']
  ];
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link=(target,text,css='')=>'<a'+(css?' class="'+css+'"':'')+' href="#'+target+'">'+text+'</a>';
  const external=(url,label,css='')=>'<a class="'+css+'" href="'+url+'" target="_blank" rel="noopener">'+label+' ↗</a>';
  const button=(action,text,css='')=>'<button class="button '+css+'" type="button" data-action="'+action+'">'+text+'</button>';
  const panel=(title,html,css='')=>'<section class="panel '+css+'"><h2>'+title+'</h2>'+html+'</section>';
  const head=(label,title,lead='')=>'<div class="head"><p class="eyebrow">'+label+'</p><h1 tabindex="-1">'+title+'</h1>'+
    (lead?'<p class="lead">'+lead+'</p>':'')+'</div>';
  const lessonLink=(id,label='Revoir le passage du cours')=>link('cours/'+id,label,'course-link');
  const blockById=id=>C.blocks.find(block=>block.id===id);
  const answered=(q,mode)=>M.response(book,M.keyFor(book,q,mode));
  const points=()=>Object.keys(book.points).length;
  let book=M.fresh(), storageIssue='', route='accueil', noticeTimer, pending=null, termTrigger=null;

  function load() {
    try {
      const raw=localStorage.getItem(M.KEY);
      if (!raw) return;
      const candidate=M.validatedBook(JSON.parse(raw),C,routes);
      if (candidate) book=candidate;
      else storageIssue='Le carnet existant utilise un format incompatible. Vous pouvez en exporter une copie brute depuis Mon carnet local.';
    } catch {
      storageIssue='Le carnet local est illisible ou inaccessible. Exportez votre travail avant de fermer.';
    }
  }
  function save(force=false) {
    if (storageIssue&&!force) return false;
    try {
      localStorage.setItem(M.KEY,JSON.stringify(book));
      storageIssue='';
      return true;
    } catch {
      storageIssue='L’enregistrement local est indisponible. Exportez votre travail avant de fermer.';
      notice(storageIssue,true);
      return false;
    }
  }
  function notice(message,persistent=false) {
    clearTimeout(noticeTimer);
    banner.hidden=false;
    banner.textContent=message;
    if (!persistent) noticeTimer=setTimeout(()=>{banner.hidden=true;},4500);
  }

  function home() {
    const count=C.blocks.filter(block=>M.consolidated(book,block.id)).length;
    const resume=book.resume!=='cours/orienter';
    return '<section class="hero"><div><p class="eyebrow">EMLV · Chapitre 1 · Introduction</p><h1 tabindex="-1">Découvrir les<br>états financiers</h1>'+
      '<p class="opening">Comment une entreprise peut-elle dégager un bénéfice et avoir moins d’argent en banque ?</p><p class="lead">Apprenez à choisir le bon document, puis suivez une prestation de sa réalisation à son règlement.</p>'+
      '<div class="actions">'+link(book.resume,resume?'Reprendre le parcours':'Commencer le parcours','button primary')+link('quiz','Ouvrir le quiz','button')+'</div></div>'+
      '<figure class="ledger"><span class="eyebrow">Cas fictif · En euros</span><h2>Studio Lumen</h2><p>Le studio réalise des vidéos pour des commerces. Son client paie le mois suivant.</p><ol>'+
      '<li><span><b>Début décembre</b><small>Solde bancaire de départ</small></span><strong>2 000 €</strong></li>'+
      '<li><span><b>Décembre</b><small>Prestation réalisée</small></span><strong>1 200 €</strong></li>'+
      '<li><span><b>Décembre</b><small>Charges réglées</small></span><strong>−700 €</strong></li>'+
      '<li><span><b>Janvier</b><small>Règlement du client</small></span><strong>+1 200 €</strong></li></ol>'+
      '<figcaption>Deux mois successifs, de la prestation à son paiement.</figcaption></figure></section>'+
      '<section class="section"><div class="section-title"><h2>Votre parcours</h2><p>'+count+'/5 blocs consolidés · '+points()+' points de pratique</p></div>'+
      '<div class="path">'+C.blocks.map((b,i)=>link('cours/'+b.id,'<span class="eyebrow">Bloc '+(i+1)+'</span><strong>'+b.title+'</strong><span>'+b.short+'</span><span class="status">'+(M.consolidated(book,b.id)?'Consolidé':'Ouvrir le cours →')+'</span>','path-card')).join('')+'</div></section>'+
      '<section class="section cards"><article class="card"><h3>Avant de commencer</h3><p>Vous pouvez partir de zéro. Les calculs utilisent des additions et des soustractions. Les mots soulignés ouvrent leur définition.</p></article>'+
      '<article class="card"><h3>Votre progression</h3><p>Vos réponses, indices, points et position sont conservés dans ce navigateur. Vous pouvez exporter votre carnet pour le reprendre ailleurs.</p></article>'+
      '<article class="card"><h3>Pour aller plus loin</h3><p>'+link('synthese','Relire la synthèse')+' ou '+external(dst,'ouvrir la Prépa DST')+'.</p></article></section>';
  }

  function course(b,index) {
    const back=history.state?.back;
    return '<div class="breadcrumbs">'+link('accueil','← Sommaire')+
      (routes.has(back)&&back!==route?' · <a href="#'+back+'" data-return-question="'+
        esc(history.state.question||'')+'">Revenir à ma question</a>':'')+'</div>'+
      head('Cours · Bloc '+(index+1)+' sur 5',b.title,b.question)+
      '<div class="columns"><div>'+panel(b.lessonTitle,b.lesson)+panel('Exemple résolu',b.example)+'</div><aside>'+
      panel('À votre tour','<p>'+b.short+'</p><div class="actions">'+link('activite/'+b.id,'Ouvrir l’activité','button primary')+'</div>','tinted')+
      panel('Cadre des exemples','<p class="meta">'+C.caseNote+'</p>','sand')+'</aside></div>'+
      '<div class="footnav">'+(index?link('cours/'+C.blocks[index-1].id,'← Cours précédent'):link('accueil','← Accueil'))+
      (index<4?link('cours/'+C.blocks[index+1].id,'Cours suivant →'):link('synthese','Synthèse →'))+'</div>';
  }

  function feedback(q,state,mode) {
    const review=lessonLink(q.block);
    if (state.solved) return '<div class="feedback"><strong>Bonne réponse</strong><p>'+q.success+'</p>'+review+'</div>';
    if (mode==='practice'&&state.revealed) {
      return '<div class="feedback tip"><strong>Correction et rappel</strong><p>'+q.success+'</p>'+review+'<p>Réutilisez la méthode dans le micro-transfert.</p></div>';
    }
    if (!state.checked) return '';
    const reason=q.options?q.reasons[Number(state.checked)]:q.wrong;
    let help='';
    if (q.hints.length&&(mode==='practice'||mode==='transfer')) {
      help='<p><strong>Indice 1</strong> - '+q.hints[0]+'</p>';
      if (state.errors>=2) help+='<p><strong>Indice 2</strong> - '+q.hints[1]+'</p>';
      if (mode==='transfer'&&state.errors>=3) {
        help+='<details><summary>Besoin d’un exemple guidé ?</summary><p>Reprenez l’exemple de « '+blockById(q.block).lessonTitle+' ». Notez les données du nouveau cas sur une feuille et appliquez une étape à la fois. Vous pouvez demander à votre enseignant de reprendre une étape avec vous.</p></details>';
      }
    }
    const correction=mode==='quiz'||mode==='challenge'?'<p><strong>Correction.</strong> '+q.success+'</p>':'';
    return '<div class="feedback error"><strong>À reprendre</strong><p>'+reason+'</p>'+help+correction+review+'</div>';
  }

  function question(q,mode) {
    const state=answered(q,mode);
    const locked=(mode==='quiz'||mode==='challenge')&&state.checked||mode==='practice'&&state.revealed;
    const disabled=locked?' disabled':'';
    const fields=q.options?q.options.map((option,i)=>'<label class="choice"><input type="radio" name="answer" value="'+i+'"'+
      (state.draft===String(i)?' checked':'')+disabled+'><span>'+option+'</span></label>').join(''):
      '<p class="formats" id="format-'+q.id+'">Écrivez le montant en euros, par exemple 1 250,00 ou -250. Les montants sont exacts.</p>'+
      '<input aria-label="Montant en euros" aria-describedby="format-'+q.id+'" type="text" name="answer" inputmode="text" maxlength="120" value="'+esc(state.draft)+'"'+disabled+'>';
    return '<form data-question="'+q.id+'" data-mode="'+mode+'" novalidate><p>'+q.prompt+'</p><fieldset><legend>'+
      (q.options?'Choisissez une seule réponse.':'Montant en euros')+'</legend>'+fields+'</fieldset><div class="actions">'+
      (locked?'':'<button class="button primary" type="submit">Vérifier</button>')+lessonLink(q.block,'Consulter le cours')+
      '</div><div class="question-result" aria-live="polite" aria-atomic="true">'+feedback(q,state,mode)+'</div></form>';
  }

  function activity(b,index) {
    const exercise=C.practice[index], transfer=C.transfers[index], state=answered(exercise,'practice');
    const show=state.solved||state.revealed;
    const required=M.transferRequired(book,b.id), done=M.consolidated(book,b.id);
    const status=done?'Bloc consolidé localement':show&&required?'Micro-transfert à réussir':'Activité en cours';
    const evaluation=evaluations[b.id];
    return '<div class="breadcrumbs">'+link('accueil','← Sommaire')+' · '+lessonLink(b.id,'Cours du bloc')+'</div>'+
      head('Activité · Bloc '+(index+1)+' sur 5',b.title,b.question)+'<div class="columns"><div>'+
      panel('À vous de jouer',question(exercise,'practice'))+
      (show?'<div id="transfer">'+panel('Micro-transfert','<p class="meta">'+(required?'Appliquez le raisonnement dans ce nouveau cas pour consolider le bloc.':'Essayez la méthode dans un autre cas.')+'</p>'+question(transfer,'transfer'),'tinted')+'</div>':'')+
      (evaluation?'<div id="evaluation">'+panel('Évaluation du bloc','<p>Après l’activité, répondez aux quatre questions dans Google Forms. Après l’envoi, sélectionnez « Afficher les résultats » pour lire votre note et les corrections.</p>'+external(esc(evaluation),'Ouvrir le quiz du bloc','button primary'),'tinted')+'</div>':'')+
      '<div class="footnav">'+lessonLink(b.id,'← Relire le cours')+
      (done?link(index<4?'cours/'+C.blocks[index+1].id:'synthese',index<4?'Passer au bloc suivant →':'Passer à la synthèse →','button primary'):'')+'</div></div><aside>'+
      panel('Dans ce bloc','<p>'+b.short+'</p><p class="pill">'+status+'</p>','sand')+'</aside></div>';
  }

  function quiz() {
    const stats=M.quizStats(book,C.quiz), last=book.quiz.history.at(-1);
    const best=Math.max(...book.quiz.history,stats.complete?stats.score:0);
    return head('Synthèse · Entraînement local','Quiz de synthèse','Cinq questions, une réponse corrigée par question et un point par réussite dans cette tentative.')+
      panel('Tentative '+book.quiz.run,'<p>'+stats.done+'/5 questions corrigées'+(stats.complete?' · Score '+stats.score+'/5':'')+
      (last===undefined?'':' · Dernier essai archivé '+last+'/5')+(stats.complete||last!==undefined?' · Meilleur score '+best+'/5':'')+'</p>'+
      (stats.complete?'<div class="actions">'+button('new-quiz','Nouvelle tentative','primary')+link('synthese','Revoir la synthèse','button')+'</div>':''),'tinted')+
      C.quiz.map((q,i)=>panel('Question '+(i+1)+' · '+blockById(q.block).title,question(q,'quiz'))).join('');
  }

  function challenge() {
    const state=book.challenge, q=C.challenge[state.index];
    const done=q&&answered(q,'challenge').checked;
    return head('Lexique et formules','Défi des repères','Dix questions. Une erreur remet la série en cours à zéro. Votre meilleure série est conservée.')+
      panel('Votre série','<p>Série en cours : '+state.streak+' · Meilleure : '+state.best+' · Palier : 10'+(state.best>=10?' · Palier atteint':'')+'</p>','tinted')+
      (q?panel('Question '+(state.index+1)+' sur 10',question(q,'challenge')+(done?'<div class="actions">'+button('next-challenge','Question suivante','primary')+'</div>':''))
      :panel('Fin du défi','<p>Meilleure série enregistrée : '+state.best+'/10.</p><div class="actions">'+button('new-challenge','Rejouer','primary')+link('lexique','Revoir le lexique','button')+'</div>'));
  }

  function lexicon() {
    const buttons=Object.keys(C.terms).sort((a,b)=>C.terms[a][0].localeCompare(C.terms[b][0],'fr'))
      .map(key=>'<button class="button" type="button" data-term="'+key+'">'+C.terms[key][0]+' <span aria-hidden="true">↗</span></button>').join('');
    return head('Banque des savoirs','Lexique et formules','Ouvrez une définition pour lire un exemple et retrouver le passage du cours.')+
      panel('Les mots du chapitre','<div class="defs">'+buttons+'</div>')+
      panel('Les formules utiles',C.formulas.map(([formula,condition,example,id])=>'<details><summary>'+formula+'</summary><p>'+condition+'</p><p>'+example+'</p>'+lessonLink(id)+'</details>').join(''));
  }

  function synthesis() {
    const criteria=['Je cite le résultat de décembre et son calcul.','Je donne la variation de trésorerie et sa cause.',
      'J’explique la créance de décembre puis son extinction en janvier.','Je précise ce qu’il reste à vérifier pour apprécier la situation financière.'];
    return head('Synthèse','Relier les trois documents','Une question, le bon document, puis une conclusion appuyée sur les chiffres.')+
      '<div class="cards"><article class="card"><h3>Bilan</h3><p>La situation à une date. Repérez les créances et la trésorerie à la clôture.</p></article>'+
      '<article class="card"><h3>Compte de résultat</h3><p>Les produits, charges et résultat de la période.</p></article>'+
      '<article class="card"><h3>Tableau des flux</h3><p>Les mouvements d’argent et la variation pendant la période.</p></article></div>'+
      '<div class="section">'+panel('Expliquez le cas Studio Lumen','<p>En trois phrases, expliquez pourquoi décembre se termine avec un bénéfice et moins d’argent en banque, puis ce que change le paiement de janvier. Précisez une information à vérifier avant de juger la situation financière du studio.</p>'+
      '<label for="note"><strong>Votre explication</strong></label><textarea id="note" maxlength="2400">'+esc(book.note)+'</textarea>'+
      '<p class="meta">Autoévaluez votre réponse à l’aide des critères suivants.</p>'+
      criteria.map((label,i)=>'<label class="choice"><input type="checkbox" data-criterion="'+i+'"'+(book.checklist.includes(i)?' checked':'')+'><span>'+label+'</span></label>').join('')+
      '<details><summary>Comparer avec une réponse possible</summary><p>En décembre, le studio dégage un bénéfice de 500 € (1 200 − 700), tandis que sa trésorerie baisse de 700 € parce que les charges sont payées et que le client doit encore 1 200 €. En janvier, le règlement augmente la trésorerie de 1 200 € et ramène la créance à zéro sans nouveau produit. Il faudrait connaître les prochaines échéances pour apprécier la situation financière.</p></details>')+
      panel('Poursuivre le chapitre','<p>Les '+C.term('ratio','ratios financiers')+' mettent des chiffres en relation pour éclairer une question de performance ou de financement.</p>'+
      '<div class="actions">'+courses.map(([label,url])=>external(url,label,'button')).join('')+'</div><div class="actions">'+
      link('quiz','Faire le quiz','button primary')+external(dst,'Ouvrir la Prépa DST','button')+'</div>','tinted')+'</div>';
  }

  function notebook() {
    const confirmation=pending?panel(pending.type==='reset'?'Effacer le carnet ?':'Remplacer le carnet ?',
      '<p>Cette action remplace vos réponses et votre progression sur cet appareil. Exportez le carnet actuel pour en garder une copie.</p><div class="actions">'+button('confirm','Confirmer','primary')+button('cancel','Annuler')+'</div>','sand'):'';
    return head('Progression et reprise','Mon carnet local','Les réponses, indices, séries, scores et la position restent dans ce navigateur. Exportez une copie JSON pour reprendre sur un autre appareil.')+
      panel('Votre progression','<p>'+points()+' points de pratique. Chaque question réussie ajoute un point par activité ou tentative. Modifier une réponse retire sa correction courante. Le point déjà obtenu est conservé.</p>'+
      (storageIssue?'<p class="feedback error">'+esc(storageIssue)+'</p>':'')+
      '<div class="actions">'+button('export','Exporter mon carnet','primary')+button('import','Importer un carnet')+
      button('reset','Effacer sur cet appareil')+(storageIssue?button('raw-export','Exporter la copie brute'):'')+
      '</div><input type="file" id="import-file" accept=".json,application/json" hidden>')+
      (confirmation?'<div class="section">'+confirmation+'</div>':'');
  }

  function render({focus=true,scroll=true}={}) {
    const hash=location.hash.slice(1);
    if (hash==='main'&&main.querySelector('h1')) {main.focus();return;}
    route=routes.has(hash)?hash:'accueil';
    const [page,id]=route.split('/');
    const index=C.blocks.findIndex(b=>b.id===id);
    if ((page==='cours'&&!history.state?.back)||['activite','synthese','quiz','defi'].includes(page)) {
      book.resume=route;
      save();
    }
    const views={accueil:home,cours:()=>course(C.blocks[index],index),activite:()=>activity(C.blocks[index],index),
      quiz,defi:challenge,lexique:lexicon,synthese:synthesis,carnet:notebook};
    main.innerHTML=views[page]();
    const active=['cours','activite','synthese'].includes(page)?'accueil':page;
    for (const item of document.querySelectorAll('nav a')) {
      if (item.getAttribute('href')==='#'+active) item.setAttribute('aria-current','page');
      else item.removeAttribute('aria-current');
    }
    const heading=main.querySelector('h1');
    document.title=(heading?.innerText.replace(/\s+/g,' ').trim()||'App 00')+' | EMLV';
    if (scroll) window.scrollTo(0,0);
    if (focus) heading?.focus({preventScroll:true});
  }

  function setDraft(input) {
    const form=input.closest('form[data-question]');
    if (!form||input.name!=='answer') return;
    const q=questions.find(item=>item.id===form.dataset.question), mode=form.dataset.mode;
    const wasSolved=answered(q,mode).solved;
    if (!M.edit(book,M.keyFor(book,q,mode),input.value)) return;
    save();
    form.querySelector('.question-result').innerHTML=feedback(q,answered(q,mode),mode);
    if ((mode==='practice'||mode==='transfer')&&!M.consolidated(book,q.block)) {
      main.querySelector('.footnav .primary')?.remove();
      const status=main.querySelector('aside .pill');
      if (status) status.textContent=M.transferRequired(book,q.block)&&main.querySelector('#transfer')?'Micro-transfert à réussir':'Activité en cours';
    }
    if (mode==='practice'&&wasSolved&&!answered(q,mode).revealed) {
      main.querySelector('#transfer')?.remove();
      const status=main.querySelector('aside .pill');
      if (status) status.textContent='Activité en cours';
    }
  }

  function download(name,data) {
    const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.download=name;
    anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function importFile(file) {
    if (!file) return;
    if (file.size>2_000_000) {notice('Le fichier dépasse la taille autorisée de 2 Mo.');return;}
    try {
      const candidate=M.validatedBook(JSON.parse(await file.text()),C,routes);
      if (!candidate) {notice('Le fichier est invalide ou utilise une version incompatible.');return;}
      if (route!=='carnet') return;
      pending={type:'import',book:candidate};
      render({focus:false,scroll:false});
      main.querySelector('[data-action="confirm"]').focus();
    } catch {notice('Le fichier est illisible.');}
  }
  function action(name) {
    if (name==='export') {download('EMLV_App00_carnet.json',JSON.stringify(book,null,2));return;}
    if (name==='raw-export') {
      try {
        const raw=localStorage.getItem(M.KEY);
        if (raw) download('EMLV_App00_carnet_brut.json',raw);
        else notice('Aucune copie brute disponible.');
      } catch {notice('Le navigateur bloque l’accès à la copie brute.');}
      return;
    }
    if (name==='import') {main.querySelector('#import-file').click();return;}
    if (name==='reset') pending={type:'reset'};
    if (name==='cancel') pending=null;
    if (name==='confirm'&&pending) {
      book=pending.type==='import'?pending.book:M.fresh();
      pending=null;
      if (save(true)) notice('Carnet local mis à jour.');
    }
    if (name==='new-quiz') M.nextQuiz(book,C.quiz);
    if (name==='next-challenge') book.challenge.index++;
    if (name==='new-challenge') Object.assign(book.challenge,{round:book.challenge.round+1,index:0,streak:0});
    save();
    render({scroll:!['reset','cancel','confirm'].includes(name)});
    if (name==='reset') main.querySelector('[data-action="confirm"]').focus();
  }

  document.addEventListener('click',event=>{
    const term=event.target.closest('[data-term]');
    if (term) {
      const [name,definition,example,block]=C.terms[term.dataset.term];
      termTrigger=document.activeElement;
      document.querySelector('#term-body').innerHTML='<h2 id="term-title">'+name+'</h2><p>'+definition+'</p><p><strong>Exemple.</strong> '+example+'</p><p>'+lessonLink(block)+'</p>';
      dialog.showModal();
      return;
    }
    const control=event.target.closest('[data-action]');
    if (control) {action(control.dataset.action);return;}
    const returnLink=event.target.closest('[data-return-question]');
    if (returnLink&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey) {
      const target=returnLink.getAttribute('href');
      const questionId=returnLink.dataset.returnQuestion;
      event.preventDefault();
      try {
        history.pushState(null,'',target);
        render();
        if (questions.some(question=>question.id===questionId)) {
          const form=main.querySelector('[data-question="'+questionId+'"]');
          if (form) {
            form.tabIndex=-1;
            form.focus({preventScroll:true});
            form.scrollIntoView({block:'nearest'});
          }
        }
      } catch {location.hash=target;}
      return;
    }
    const review=event.target.closest('.course-link');
    if (review&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey) {
      const target=review.getAttribute('href');
      if (dialog.open) dialog.close();
      event.preventDefault();
      if (target==='#'+route) return;
      try {history.pushState({back:route,question:review.closest('[data-question]')?.dataset.question},'',target);render();}
      catch {location.hash=target;}
    }
  });
  dialog.addEventListener('close',()=>{if (termTrigger?.isConnected) termTrigger.focus();});
  document.addEventListener('input',event=>{
    const input=event.target;
    if (input.id==='note') {book.note=input.value;save();}
    else if (input.name==='answer') setDraft(input);
  });
  document.addEventListener('change',event=>{
    const input=event.target;
    if (input.id==='import-file') importFile(input.files[0]);
    if (input.dataset.criterion!==undefined) {
      const index=Number(input.dataset.criterion);
      book.checklist=input.checked?[...new Set([...book.checklist,index])]:book.checklist.filter(value=>value!==index);
      save();
    }
  });
  document.addEventListener('submit',event=>{
    const form=event.target;
    if (!form.matches('[data-question]')) return;
    event.preventDefault();
    const q=questions.find(item=>item.id===form.dataset.question), mode=form.dataset.mode;
    const result=M.check(book,M.keyFor(book,q,mode),q,mode);
    const output=form.querySelector('.question-result');
    if (result.repeat) return;
    if (result.error) {output.innerHTML='<div class="feedback tip">'+esc(result.error)+'</div>';return;}
    save();
    if ((mode==='practice'&&(result.correct||answered(q,mode).revealed))||mode==='transfer'&&result.correct||mode==='quiz'||mode==='challenge') {
      render({focus:false,scroll:false});
      const updated=main.querySelector('[data-question="'+q.id+'"] .question-result');
      updated.tabIndex=-1;
      updated.focus({preventScroll:true});
      updated.scrollIntoView({block:'nearest'});
      return;
    }
    output.innerHTML=feedback(q,answered(q,mode),mode);
  });
  window.addEventListener('hashchange',()=>{pending=null;render();});
  window.addEventListener('storage',event=>{
    if (event.key!==M.KEY||storageIssue) return;
    storageIssue='Le carnet a été modifié dans un autre onglet. Rechargez cette page pour reprendre la dernière version. Vous pouvez exporter vos modifications en cours.';
    notice(storageIssue,true);
  });
  load();
  render({focus:false});
  if (storageIssue) notice(storageIssue,true);
})();
