// Generate a haiku using Compromise POS tagging,
// Tracery CFG, & Regex syllable approximation

const filler = "blah";

function get_end_nodes(alt_txt) {
  const terms = window.nlp(alt_txt).terms().json();
  const end_nodes = {};
  terms.forEach((term) => {
    const text = term.terms[0].text.toLowerCase();
    const pos = term.terms[0].tags.join("_").toLowerCase();
    if (!(pos in end_nodes)) {
      end_nodes[pos] = [];
    }
    if (!end_nodes[pos].includes(text)) {
      end_nodes[pos].push(text);
    }
  });
  return end_nodes;
}

// TODO(anna): this needs fixing & tuning.
function create_grm(end_nodes) {
  return {
    // Origins
    "0-l1": ["#comparable_adjective# #N#"],
    "0-l2": ["and #comparable_adjective# #comparable_adjective# #N#"],
    "0-l3": ["#preposition# #comparable_adjective# #N#"],

    // Nouns
    NP: ["#AP# #N#", "#N#"],
    N: [
      "#noun#",
      "#noun_plural#",
      "#noun_singular#",
      "#noun_propernoun_singular#",
      "#uncountable_noun#",
    ],
    noun: end_nodes.noun || [filler],
    noun_plural: end_nodes.noun_plural || [filler],
    noun_singular: end_nodes.noun_singular || [filler],
    uncountable_noun: end_nodes.uncountable_noun || [filler],
    noun_propernoun_plural: end_nodes.noun_propernoun_singular || [filler],
    noun_propernoun_singular: end_nodes.noun_propernoun_singular || [filler],

    // Adjectives
    AP: ["#A#", "#A# and #A#", "#A#, #A#, and #A#"],
    A: ["#adjective#", "#comparable_adjective#", "#adjective#, #adjective#"],
    adjective: end_nodes.adjective || [filler],
    comparable_adjective: end_nodes.comparable_adjective || [filler],
    comparative_adjective: end_nodes.comparative_adjective || [filler],
    superlative_adjective: end_nodes.superlative_adjective || [filler],

    // Verbs
    VP: ["#adverb# #verb#", "#verb# #adverb#"],
    V: ["#verb#", "#pasttense_verb#", "#presenttense_verb#"],
    verb: end_nodes.verb || [filler],
    pasttense_verb: end_nodes.pasttense_verb || [filler],
    presenttense_verb: end_nodes.presenttense_verb || [filler],

    // Adverbs
    adverb: end_nodes.adverb || [filler],

    // Prepositions
    preposition: [
      "next to",
      "sitting by",
      "surrounded by",
      "hiding amongst",
      "alongside",
      "below",
      "beside",
      "entangled with",
      "by",
      "nestled between",
    ],

    // Conjunctions
    conjunction: end_nodes.conjunction || [filler],

    // Determiners
    determiner: end_nodes.determiner || [filler],

    // Question words
    questionword: end_nodes.questionword || [filler],
  };
}

function count_line_sylls(line) {
  const words = line.split(" ");
  let sylls = 0;
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    sylls += count_word_sylls(word);
  }
  return sylls;
}

// TODO(anna): this needs some tuning.
function count_word_sylls(word) {
  word = word.toLowerCase();
  if (word.length <= 3) {
    return 1;
  }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 0;
}

function create_line(grm, origin, sylls, tries) {
  const generator = tracery.createGrammar(grm);
  let line = "";
  for (let i = 0; i < tries; i += 1) {
    line = generator.flatten(origin);
    if (count_line_sylls(line) === sylls) {
      return line;
    }
  }
  return "blah ".repeat(sylls);
}

function haiku(alt) {
  alt_txt = alt.replaceAll("|", "");

  // Get end nodes from alt text
  const end_nodes = get_end_nodes(alt_txt);
  console.log(end_nodes);

  // Create the grammar
  const grm = create_grm(end_nodes);

  // Initialize the haiku
  let haiku = "";

  // Generate the haiku, line by line
  haiku += `${create_line(grm, "#0-l1#", 5, 500)}<br/>`;
  haiku += `${create_line(grm, "#0-l2#", 7, 500)}<br/>`;
  haiku += `${create_line(grm, "#0-l3#", 5, 500)}<br/>`;

  // Write to DOM
  // const haikuDiv = document.createElement("div");
  // haikuDiv.style = "margin: 10%; line-height: 1;";
  // altHaiku.innerHTML = haiku;

  altList.classList.add("haiku");
  altList.innerHTML = "";

  let altP = document.createElement("p");
  altP.innerHTML = haiku;
  altList.appendChild(altP);
}

// setTimeout(haiku, 10);
