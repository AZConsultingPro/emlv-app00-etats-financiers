'use strict';
(function (root) {
  const terms = {
    etats:['États financiers','Documents comptables qui décrivent la situation, la performance et les flux d’une entité.','Le bilan est un état financier.','orienter'],
    perimetre:['Périmètre','Ensemble des entités couvertes par les chiffres. Les comptes individuels couvrent une entité. Les comptes consolidés présentent un groupe comme un ensemble économique.','La société mère seule et son groupe couvrent des périmètres différents.','orienter'],
    unite:['Unité','Échelle de présentation des chiffres. k€ signifie milliers d’euros et M€ millions d’euros.','12 k€ valent 12 000 €.','orienter'],
    cloture:['Clôture','Date de fin de la période comptable présentée.','Le bilan de décembre est établi au 31 décembre.','orienter'],
    bilan:['Bilan','État des actifs, des passifs et des capitaux propres à une date.','On y lit le solde bancaire au 31 décembre.','bilan'],
    actif:['Actif','Ressource contrôlée par l’entreprise.','Un équipement, le solde bancaire et une créance client sont des actifs.','bilan'],
    passif:['Passif','Au sens utilisé ici, obligation actuelle envers un tiers. Dans la présentation française, « passif » peut aussi désigner toute la colonne de financement, capitaux propres compris.','Un emprunt à rembourser est un passif.','bilan'],
    capitaux:['Capitaux propres','Part comptable qui reste après déduction des passifs de l’actif. Elle comprend notamment les apports et les résultats conservés.','2 000 € d’apport et 500 € de bénéfice conservé donnent 2 500 € dans notre cas.','bilan'],
    dette:['Dette','Somme que l’entreprise doit à un tiers.','Une facture fournisseur de 250 € reste à payer.','bilan'],
    creance:['Créance client','Droit à recevoir un paiement du client.','La prestation de décembre, payée en janvier, crée une créance au 31 décembre.','bilan'],
    produit:['Produit','Élément qui contribue à augmenter le résultat de la période.','La prestation est un produit du mois où elle est réalisée dans notre cas.','resultat'],
    charge:['Charge','Élément qui contribue à diminuer le résultat de la période.','Une location utilisée en décembre est une charge de décembre.','resultat'],
    resultat:['Résultat net','Différence entre tous les produits et toutes les charges de la période, impôt compris lorsqu’il s’applique.','1 200 € − 700 € = 500 € de bénéfice.','resultat'],
    engagement:['Comptabilité d’engagement','Rattachement des produits et des charges à la période où ils sont acquis ou engagés, selon les règles applicables.','Le service rendu en décembre est comptabilisé en décembre.','resultat'],
    tresorerie:['Trésorerie','Montant disponible à une date. Dans nos cas, elle se limite au solde bancaire.','1 300 € sont disponibles au 31 décembre.','flux'],
    encaissement:['Encaissement','Entrée d’argent.','Le paiement reçu en janvier est un encaissement de janvier.','flux'],
    decaissement:['Décaissement','Sortie d’argent.','Le virement au fournisseur est un décaissement.','flux'],
    flux:['Tableau des flux de trésorerie','Document qui explique la variation de trésorerie pendant une période.','Il montre comment 2 000 € en début de mois deviennent 1 300 € en fin de mois.','flux'],
    ratio:['Ratio financier','Rapport entre deux grandeurs qui éclaire une question financière. Sa lecture dépend notamment de la période et du secteur.','Rapporter le bénéfice aux ventes aide à lire ce que l’activité dégage pour 100 € de ventes.','croiser']
  };
  const term=(key,label=terms[key][0])=>'<button class="term" type="button" data-term="'+key+'">'+label+'</button>';
  const p=text=>'<p>'+text+'</p>';
  const steps=(...items)=>'<ol class="steps">'+items.map(item=>'<li>'+item+'</li>').join('')+'</ol>';
  const details=(title,body)=>'<details><summary>'+title+'</summary>'+body+'</details>';
  const table=(caption,head,rows)=>'<div class="table-box"><table><caption>'+caption+'</caption><thead><tr>'+
    head.map((value,i)=>'<th scope="col"'+(i?' class="number"':'')+'>'+value+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(([label,...values])=>'<tr'+(/^(Total|Résultat net|Trésorerie finale)/.test(label)?' class="total"':'')+'><th scope="row">'+label+'</th>'+
      values.map(value=>'<td class="number">'+value+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  const caseNote='Cas fictifs, tableaux simplifiés, en euros sauf indication. Décembre N et janvier N+1 sont deux mois successifs. Une seule entité, sans TVA, impôt, distribution ni autre opération que celles indiquées.';
  const blocks=[
    {id:'orienter',title:'S’orienter',short:'Choisir le document et lire son en-tête.',question:'Où chercher l’information dont vous avez besoin ?',lessonTitle:'Trois questions, trois documents',
     lesson:p('Les '+term('etats','états financiers')+' aident un dirigeant à suivre son activité, un prêteur à examiner la situation de l’entreprise et un investisseur à lire sa performance.')+
      '<ul><li><b>Bilan</b> - Quelle est la situation à une date ?</li><li><b>Compte de résultat</b> - Quel bénéfice ou quelle perte sur la période ?</li><li><b>Tableau des flux</b> - Quels mouvements d’argent sur la période ?</li></ul>'+
      p('Dans un rapport annuel, cherchez la rubrique « États financiers », puis le titre du tableau. Vérifiez les dates, l’'+term('unite','unité')+' et le '+term('perimetre','périmètre')+'. La '+term('cloture','clôture')+' marque la fin de la période comptable.')+
      p('Un jeu complet selon les normes internationales d’information financière (IFRS) comprend aussi le tableau des variations des '+term('capitaux','capitaux propres')+', qui explique leur évolution, et les notes, qui précisent les méthodes et les postes.')+
      details('Publications et référentiels',p('Selon la norme IAS 1, le résultat et les autres éléments du résultat global peuvent être présentés ensemble ou séparément. Des comparatifs sont présentés et un bilan d’ouverture comparatif est requis dans certains cas.')+
      p('Le Plan comptable général (PCG) est le référentiel de droit commun des comptes individuels concernés en France. Les sociétés de l’Union européenne dont les titres sont négociés sur un marché réglementé établissent leurs comptes consolidés selon les IFRS adoptées par l’Union européenne. Pour un exercice ouvert en 2026, IAS 1 s’applique en l’absence d’adoption anticipée d’IFRS 18. IFRS 18 s’applique aux exercices ouverts à partir du 1er janvier 2027.')+
      p('La SEC américaine reçoit le 10-K annuel et le 10-Q des trois premiers trimestres des émetteurs concernés. En France, l’AMF encadre l’information périodique, dont les rapports financiers annuels et semestriels, selon le marché et le statut.')),
     example:p('Studio Lumen réalise des vidéos pour des commerces. Vous cherchez le solde bancaire à la fin de décembre.')+
      steps('Ouvrez le bilan au 31 décembre N.','Vérifiez le périmètre (Studio Lumen seule) et l’unité (€).','Lisez « Trésorerie » à l’actif. Le solde est de 1 300 €. Les « Créances clients » indiquent les montants qui restent à encaisser.')+
      table('Studio Lumen seule - Extrait du bilan au 31 décembre N (€)',['Poste','Montant'],[['Trésorerie','1 300'],['Créances clients','1 200']])+
      p('Consultez les flux de décembre pour expliquer l’évolution du solde bancaire.')},
    {id:'bilan',title:'Lire le bilan',short:'Repérer les ressources et leurs financements.',question:'Quelle est la situation au 31 décembre ?',lessonTitle:'Lire une situation à une date',
     lesson:p('Le '+term('bilan','bilan')+' présente l’'+term('actif','actif')+', les '+term('passif','passifs')+' et les '+term('capitaux','capitaux propres')+'. Une '+term('creance','créance client')+' est un droit à recevoir un règlement. Une '+term('dette','dette')+' est une somme à payer à un tiers.')+
      p('<b>Actif = capitaux propres + passifs.</b> Le bénéfice conservé augmente les capitaux propres dans notre cas.'),
     example:table('Studio Lumen seule - Bilan au 31 décembre N (€)',['Poste','Montant'],[['Trésorerie','1 300'],['Créances clients','1 200'],['Total de l’actif','2 500'],['Capitaux propres','2 500'],['Passifs','0'],['Total des financements','2 500']])+
      steps('1 300 € en banque + 1 200 € de créance = 2 500 € d’actif.','2 000 € d’apport + 500 € de bénéfice = 2 500 € de capitaux propres.','La créance reste à encaisser. Vérifiez son échéance pour savoir quand le paiement est attendu.')},
    {id:'resultat',title:'Lire le compte de résultat',short:'Relier produits, charges et bénéfice.',question:'Comment l’activité dégage-t-elle un bénéfice en décembre ?',lessonTitle:'Mesurer la performance de la période',
     lesson:p('Le compte de résultat présente les '+term('produit','produits')+' et les '+term('charge','charges')+' d’une période. Le '+term('resultat','résultat net')+' est leur différence. Un montant positif est un bénéfice. Un montant négatif est une perte.')+
      p('En '+term('engagement','comptabilité d’engagement')+', le produit de notre prestation est rattaché au mois où le service est entièrement rendu.'),
     example:table('Studio Lumen seule - Compte de résultat de décembre N (€)',['Poste','Montant'],[['Produits','1 200'],['Charges','700'],['Résultat net','+500']])+
      steps('Le service rendu génère un produit de 1 200 €. Les charges s’élèvent à 700 €.','1 200 € − 700 € = +500 €. Décembre dégage un bénéfice.','Consultez les flux pour vérifier le mois où le client a payé.')},
    {id:'flux',title:'Lire les flux de trésorerie',short:'Expliquer les mouvements d’argent.',question:'Comment passe-t-on de 2 000 € à 1 300 € ?',lessonTitle:'Suivre les entrées et les sorties d’argent',
     lesson:p('La '+term('tresorerie','trésorerie')+' est le montant disponible à une date. Le '+term('flux','tableau des flux')+' présente les '+term('encaissement','encaissements')+' (entrées) et les '+term('decaissement','décaissements')+' (sorties) de la période.')+
      p('<b>Variation = entrées − sorties. Trésorerie finale = trésorerie initiale + variation.</b>')+
      details('Les trois familles de flux',p('Exploitation - encaisser le règlement d’un client. Investissement - payer un équipement durable. Financement - recevoir l’argent d’un emprunt. Des effets de change peuvent aussi intervenir dans le rapprochement des soldes.')),
     example:table('Studio Lumen seule - Flux de décembre N (€)',['Poste','Montant'],[['Trésorerie initiale','2 000'],['Encaissements','0'],['Décaissements','−700'],['Investissement et financement','0'],['Variation','−700'],['Trésorerie finale','1 300']])+
      steps('Le studio règle 700 €. Le client paiera en janvier.','Variation : 0 € − 700 € = −700 €. Trésorerie finale : 2 000 € − 700 € = 1 300 €.','Pour savoir si le solde suffit, vérifiez les prochains règlements à effectuer.')},
    {id:'croiser',title:'Croiser les documents',short:'Expliquer le décalage entre la vente et le paiement.',question:'Comment un bénéfice peut-il coexister avec une baisse de trésorerie ?',lessonTitle:'Suivre la vente puis le règlement',
     lesson:p('Quand Studio Lumen termine la prestation à crédit, le studio enregistre un produit et une créance. Quand le client règle, la trésorerie augmente et la créance disparaît. Le résultat du mois du règlement reste inchangé par ce paiement.')+
      p('Relevez les données utiles, calculez, formulez le constat, expliquez la cause et précisez ce qu’il reste à vérifier.'),
     example:table('Studio Lumen seule - Deux mois successifs (€)',['Document et poste','Déc.','Janv.'],[['Compte de résultat - Produits','1 200','0'],['Compte de résultat - Charges','700','0'],['Résultat net','+500','0'],['Flux - Solde initial','2 000','1 300'],['Flux - Encaissements','0','1 200'],['Flux - Décaissements','−700','0'],['Flux - Variation','−700','+1 200'],['Bilan - Trésorerie','1 300','2 500'],['Bilan - Créances','1 200','0'],['Total de l’actif','2 500','2 500'],['Bilan - Capitaux propres','2 500','2 500'],['Bilan - Passifs','0','0']])+
      steps('Décembre : 500 € de bénéfice et 700 € de baisse de trésorerie. Le client doit encore 1 200 €.','Janvier : la trésorerie progresse de 1 200 € et la créance tombe à zéro. L’actif reste de 2 500 €.','Vérifiez les échéances futures et d’autres périodes pour apprécier la situation financière.')}
  ];
  const mc=(id,block,prompt,options,answer,success,reasons,hints=[])=>({id,block,prompt,options,answer,success,reasons,hints});
  const num=(id,block,prompt,answer,success,wrong,hints=[])=>({id,block,prompt,answer,success,wrong,hints});
  const practice=[
    mc('p-orienter','orienter','Vélo des Rives répare des vélos. Vous cherchez les factures clients encore impayées au 31 mars pour cette seule société. Les documents de Vélo des Rives sont en k€.<br><strong>Compte de résultat de mars</strong> - Produits : 12.<br><strong>Bilan au 31 mars</strong> - Créances clients : 12.<br><strong>Flux de mars</strong> - Encaissements : 12.<br>Quelle lecture correspond à votre recherche ?',
      ['Compte de résultat de mars - Produits de 12 000 €','Bilan au 31 mars - Créances clients de 12 000 € pour Vélo des Rives seule','Tableau des flux de mars - Encaissements de 12 000 €','Bilan au 31 mars - Créances clients de 12 € pour l’ensemble du groupe'],1,
      'Le bilan donne une situation au 31 mars. Les créances clients de 12 k€, soit 12 000 €, sont à recevoir par la seule société Vélo des Rives.',
      ['Les produits couvrent l’activité du mois.','','Les encaissements indiquent l’argent reçu pendant mars.','12 k€ valent 12 000 €. La question porte sur une seule société.'],
      ['Repérez la date et les mots « encore impayées ».','Choisissez le poste à recevoir, convertissez les k€ en euros, puis vérifiez le périmètre.']),
    mc('p-bilan','bilan','Mistral Scène loue du matériel. Au 30 juin, elle a 900 € en banque, 600 € à recevoir et une dette fournisseur de 250 €. Quels sont ses totaux ?',
      ['Actif 900 € et capitaux propres 650 €','Actif 1 750 € et capitaux propres 1 500 €','Actif 1 500 € et capitaux propres 1 500 €','Actif 1 500 € et capitaux propres 1 250 €'],3,
      'L’actif vaut 900 + 600 = 1 500 €. Les capitaux propres valent 1 500 − 250 = 1 250 €.',
      ['La créance fait aussi partie de l’actif.','La dette fournisseur est un passif.','L’actif est correct. Déduisez la dette.',''],
      ['Classez chaque montant.','Additionnez banque et créances. Isolez ensuite les capitaux propres.']),
    num('p-resultat','resultat','Signal Atelier fabrique des enseignes. En avril, il réalise 2 400 € de prestations, dont 600 € payés en mai, et supporte 1 050 € de charges. Quel est le résultat net d’avril ?',
      1350,'2 400 € − 1 050 € = +1 350 €. Toutes les prestations sont réalisées en avril.','Les 600 € encaissés en mai font partie des prestations réalisées en avril.',
      ['Identifiez le mois de réalisation.','Soustrayez les charges d’avril à tous les produits d’avril.']),
    num('p-flux','flux','Rouge Papier imprime des affiches. Elle commence mai avec 1 600 € en banque. Elle encaisse 420 € et paie 950 €. Quelle est la variation de trésorerie de mai ?',
      -530,'420 € − 950 € = −530 €. Le solde final est de 1 070 €.','Pour la variation, comparez les entrées et les sorties du mois.',
      ['Repérez les paiements du mois.','Faites entrées moins sorties et gardez le signe.']),
    mc('p-croiser','croiser','Nord Son enregistre des podcasts. En septembre, le studio réalise une prestation de 1 800 € payée en octobre et règle 1 100 € de charges de septembre. Quelle lecture est correcte ?',
      ['Résultat +700 € · variation +700 € · créance 0 €','Résultat −1 100 € · variation −1 100 € · créance 1 800 €','Résultat +700 € · variation −1 100 € · créance 1 800 €','Résultat +1 800 € · variation −1 100 € · créance 1 800 €'],2,
      'Le résultat vaut 1 800 − 1 100 = +700 €. Le flux vaut −1 100 €. La créance de 1 800 € reste à recevoir en octobre.',
      ['Le client paie en octobre. La créance reste à recevoir.','La prestation est déjà réalisée en septembre.','','Soustrayez les charges pour calculer le résultat.'],
      ['Séparez le mois de la prestation du mois du paiement.','Calculez séparément le résultat, le flux réel et la somme à recevoir.'])
  ];
  const transfers=[
    mc('t-orienter','orienter','Le « Compte de résultat consolidé du 1er janvier au 30 juin, en k€ » de Groupe Estuaire affiche 42 sur la ligne Résultat net. Comment le lire ?',
      ['42 € pour le groupe au 30 juin','42 000 € pour la mère seule sur six mois','42 000 € pour le groupe sur six mois','42 000 € pour le groupe sur le seul mois de juin'],2,'42 k€ valent 42 000 €. Les comptes consolidés couvrent le groupe sur six mois.',
      ['Vérifiez l’unité et les deux dates.','« Consolidé » indique le groupe.','','La période commence le 1er janvier.'],['Relisez les trois repères.','Convertissez les milliers d’euros et identifiez l’entité et la période.']),
    num('t-bilan','bilan','Papeterie Ginkgo vend des fournitures. Au 30 avril, son actif vaut 4 800 € et ses capitaux propres 3 300 €. Quel est le total de ses passifs ?',
      1500,'4 800 € − 3 300 € = 1 500 € de passifs.','Isolez les passifs dans l’égalité du bilan.',['Écrivez l’égalité du bilan.','Déduisez les capitaux propres de l’actif.']),
    mc('t-resultat','resultat','L’Atelier des Cartes imprime sur commande. Il reçoit en mai 800 € pour une prestation entièrement réalisée en avril. Quel produit cette opération crée-t-elle en mai ?',
      ['800 €','0 €','400 €','−800 €'],1,'Le produit est rattaché à avril. Le paiement en mai ne crée aucun nouveau produit.',
      ['800 € est le règlement reçu.','','La prestation a été entièrement réalisée en avril.','Le règlement éteint une créance.'],['Identifiez la date de la prestation.','Associez le service au produit et le paiement à l’encaissement.']),
    num('t-flux','flux','Dune Photo loue un studio. Elle commence juin avec 740 €, encaisse 500 € et décaisse 120 €. Quelle est sa trésorerie finale ?',
      1120,'La variation est de +380 €. Le solde final est de 740 € + 380 € = 1 120 €.','La question porte sur le solde final. Utilisez le solde de départ.',
      ['Repérez le solde de départ et les deux mouvements.','Ajoutez la variation de 500 € − 120 € au solde initial.']),
    mc('t-croiser','croiser','Jardin Minute entretient des jardins. En février, il encaisse 950 € pour un entretien entièrement réalisé et facturé en janvier. Quels effets cette seule opération a-t-elle en février ?',
      ['Produit +950 € · encaissement +950 € · créance −950 €','Produit 0 € · encaissement 0 € · créance −950 €','Produit 0 € · encaissement +950 € · créance +950 €','Produit 0 € · encaissement +950 € · créance −950 €'],3,
      'Le produit a été enregistré en janvier. En février, le règlement apporte 950 € et diminue la créance de 950 €.',
      ['Le produit date de janvier.','Le paiement a bien lieu en février.','Le paiement réduit la somme restant due.',''],
      ['Séparez service et paiement.','Vérifiez le produit déjà comptabilisé, l’argent reçu et la somme qui reste due.'])
  ];
  const quiz=[
    mc('q-orienter','orienter','Quel document explique la baisse d’argent disponible sur le trimestre ?',['Bilan à la clôture','Tableau des variations des capitaux propres','Tableau des flux du trimestre','Compte de résultat du trimestre'],2,'Le tableau des flux explique les mouvements et leur effet sur le solde.',['Le bilan indique le solde à une date.','Ce tableau explique les capitaux propres.','','Le résultat mesure la performance comptable.']),
    mc('q-bilan','bilan','Un client doit encore payer une prestation de Studio Nacre. Où la somme figure-t-elle à la clôture ?',['Actif - Créances clients','Actif - Trésorerie','Passifs - Dettes','Capitaux propres - Capital'],0,'Le studio a un droit à recevoir le paiement.',['','Le paiement reste à encaisser.','Le client doit au studio.','Le capital comprend les apports.']),
    num('q-resultat','resultat','Grain Studio fait de la retouche photo. En août, il réalise 900 € de prestations et supporte 1 100 € de charges. Quel est son résultat ?',-200,'900 € − 1 100 € = −200 €, une perte.','Soustrayez les charges aux produits.'),
    num('q-flux','flux','Taxi Verve commence juillet avec 500 € en banque. Il encaisse et décaisse 250 € pendant le mois. Quelle est sa variation de trésorerie ?',0,'250 € − 250 € = 0 €. Le solde reste à 500 €.','Comparez les deux flux. Le solde de départ sert à calculer le solde final.'),
    mc('q-croiser','croiser','Aube Vidéo livre une prestation le 28 octobre et reçoit son règlement le 4 novembre. Quand enregistrer produit et encaissement ?',['Tous deux en novembre','Tous deux en octobre','Produit en novembre, encaissement en octobre','Produit en octobre, encaissement en novembre'],3,'Le service est réalisé en octobre et le mouvement bancaire a lieu en novembre.',['Le produit se rattache à la réalisation d’octobre.','L’argent arrive en novembre.','Relisez la chronologie.',''])
  ];
  const challenge=[
    mc('d1','orienter','Un bilan en k€ affiche 18 de trésorerie. Quel est le montant en euros ?',['18 €','180 €','18 000 €','18 000 000 €'],2,'18 × 1 000 = 18 000 €.',['Convertissez les milliers.','Vous multipliez ici par 10.','','Ce montant correspondrait à 18 M€.']),
    mc('d2','orienter','Quel libellé indique des comptes couvrant un groupe ?',['Consolidés','Annuels','Intermédiaires','Individuels'],0,'Les comptes consolidés couvrent le groupe.',['','Annuel renseigne sur la période.','Intermédiaire renseigne sur la période.','Individuel désigne une entité.']),
    mc('d3','bilan','Dans quelle famille classer un équipement durable contrôlé par l’entreprise ?',['Passifs','Charges de personnel','Capitaux propres','Actifs'],3,'C’est une ressource contrôlée.',['Un passif est une obligation.','Les charges de personnel concernent les coûts du travail.','Les capitaux propres représentent une source de financement.','']),
    mc('d4','bilan','Quel poste représente une obligation de payer un tiers ?',['Trésorerie','Dette fournisseur','Créance client','Apport des propriétaires'],1,'La dette fournisseur représente une somme à régler.',['La trésorerie est disponible.','','Le client doit payer l’entreprise.','L’apport fait partie des capitaux propres.']),
    mc('d5','resultat','Quel élément diminue le résultat de la période ?',['Produit','Créance','Charge','Capital'],2,'Les charges diminuent le résultat.',['Les produits l’augmentent.','Une créance est un droit.','','Le capital appartient au bilan.']),
    num('d6','resultat','Quel résultat obtient une entreprise avec 800 € de produits et 300 € de charges ?',500,'800 € − 300 € = +500 €.','Posez la soustraction produits moins charges.'),
    mc('d7','flux','Quel terme décrit un virement reçu d’un client ?',['Encaissement','Décaissement','Créance client','Dette fournisseur'],0,'Le virement reçu est une entrée d’argent.',['','Le décaissement est une sortie.','Une créance est un droit à recevoir.','Une dette fournisseur est une obligation.']),
    num('d8','flux','Une entreprise reçoit 120 € et paie 170 €. Quelle est la variation de trésorerie ?',-50,'120 € − 170 € = −50 €.','Soustrayez les sorties aux entrées et gardez le signe.'),
    mc('d9','croiser','Un client règle une ancienne facture. Quel poste diminue ?',['Trésorerie','Capitaux propres','Dettes fournisseurs','Créances clients'],3,'Le client doit moins d’argent après son règlement.',['La trésorerie augmente.','Le règlement ne crée aucun nouveau résultat.','Le règlement est reçu d’un client.','']),
    mc('d10','croiser','Quel contrôle permet d’examiner l’hypothèse d’un paiement client différé ?',['Comparer seulement produits et charges','Rechercher les factures impayées et leurs dates de règlement','Lire seulement les capitaux propres','Comparer le bénéfice à l’apport initial'],1,'Rapprochez les créances des échéances et des règlements.',['Le résultat n’indique pas les dates de paiement.','','Les capitaux propres renseignent sur le financement.','Cette comparaison n’indique pas le calendrier client.'])
  ];
  const formulas=[
    ['Actif = capitaux propres + passifs','À une même date et pour la même entité.','2 500 € = 2 500 € + 0 €.','bilan'],
    ['Résultat = produits − charges','Sur une même période, impôt compris lorsqu’il s’applique.','1 200 € − 700 € = +500 €.','resultat'],
    ['Variation = encaissements − décaissements','Utilisez les sorties comme montants positifs dans la soustraction.','0 € − 700 € = −700 €.','flux'],
    ['Trésorerie finale = trésorerie initiale + variation','Utilisez la variation signée et une seule unité.','2 000 € + (−700 €) = 1 300 €.','flux']
  ];
  root.EMLVContent={terms,term,blocks,caseNote,practice,transfers,quiz,challenge,formulas};
})(typeof module==='object'?module.exports:window);
