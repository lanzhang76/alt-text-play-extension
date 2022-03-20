function displayList(altTextGroup) {
  altTextGroup.forEach((altText) => {
    let altP = document.createElement("li");
    altP.innerText = altText;
    altList.appendChild(altP);
  });
  altList.classList.add("active");
  [verbs, nouns, adjs] = processText(altTextGroup);

  nouns.forEach((noun) => {
    let nounLi = document.createElement("span");
    nounLi.innerText = noun;
    nounsBox.appendChild(nounLi);
  });

  verbs.forEach((verb) => {
    let verbLi = document.createElement("span");
    verbLi.innerText = verb;
    verbsBox.appendChild(verbLi);
  });

  adjs.forEach((adj) => {
    let adjLi = document.createElement("span");
    adjLi.innerText = adj;
    adjsBox.appendChild(adjLi);
  });
}

function processTextOLD(altTextGroup) {
  let nouns = [];
  altTextGroup.forEach((altText) => {
    // console.log(altText);
    let txt = nlp(altText);
    let v = txt.verbs();
    if (v.length > 0) {
      verbs.push(...v.text().split(" "));
    }

    let n = txt.nouns();
    if (n.length > 0) {
      nouns.push(...n.text().split(" "));
    }

    let ajson = txt.adjectives().json();
    if (ajson.length > 0) {
      for (var a in ajson) adjs.push(ajson[a].text);
    }
  });

  console.log(nouns);
  return [verbs, nouns, adjs];
}

function processText(altGroup) {
  altGroup.forEach((altText) => {
    let txt = nlp(altText);
    let p2 = document.createElement("p");

    let n = txt.json();
    let terms = n[0].terms;
    terms.forEach((term) => {
      console.log(term.text, term.tags);
      if (
        Object.values(term.tags).indexOf("Noun") > -1 &&
        term.text.toLowerCase() != "the"
      ) {
        library.nouns.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Preposition") > -1) {
        library.prepositions.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Adjective") > -1) {
        library.adjectives.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Verb") > -1) {
        library.verbs.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Determiner") > -1) {
        library.determiners.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Adverb") > -1) {
        library.adverbs.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Pronoun") > -1) {
        library.pronoun.push(term.text);
      }

      if (Object.values(term.tags).indexOf("Conjunction") > -1) {
        library.conjunction.push(term.text);
      }
    });
  });
}

function makeUpSentence(INDEX) {
  rules = formats[INDEX];

  let words = [];
  let sentence = "";
  rules.forEach((rule) => {
    let group = library[`${rule}`];
    let word = randomWord(group);
    words.push(word);
  });
  sentence = words.join(" ");
  sentence = sentence.replace(/\s*,/g, ",");

  function randomWord(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  return sentence;
}

function printOutWords() {
  console.log("nouns: " + library.nouns);
  console.log("prepositions:" + library.prepositions);
  console.log("verbs:" + library.verbs);
  console.log("adjectives:" + library.adjectives);
  console.log("determiners:" + library.determiners);
  console.log("adverbs" + library.adverbs);
  console.log("pronoun" + library.pronoun);
  console.log("conjunction" + library.conjunction);
}

function generateSentences(num, INDEX) {
  altList.innerText = "";
  for (let i = 0; i < num; i++) {
    let p = document.createElement("p");
    p.innerText = makeUpSentence(INDEX);
    console.log(p);
    altList.append(p);
    altList.classList.add("active");
  }
}
