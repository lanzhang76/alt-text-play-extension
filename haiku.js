// Generate a haiku using Compromise POS tagging,
// Tracery CFG, & Regex syllable approximation

function get_end_nodes(alt_txt) {
    const terms = window.nlp(alt_txt).terms().json();
    const end_nodes = {};
    terms.forEach((term) => {
        const text = term.terms[0].text.toLowerCase();
        const pos = term.terms[0].tags.join("_").toLowerCase();
        if (!(pos in end_nodes)) {
            end_nodes[pos] = []
        }
        end_nodes[pos].push(text);
    })
    return end_nodes;
}

// TODO(anna): this needs fixing & tuning.
function create_grm(end_nodes) {
    return {
        // Origins
        "l1": ["#adjective# #noun_plural#"],
        "l2": ["and #adjective# #noun_plural#"],
        "l3": ["#preposition# #noun_plural#"],
    
        // Nouns
        "noun": end_nodes.noun || [],
        "noun_plural": end_nodes.noun_plural || [],
        "noun_singular": end_nodes.noun_singular || [],
        "uncountable_noun":  end_nodes.uncountable_noun || [],
    
        // Adjectives
        "adjective": end_nodes.adjective || [],
        "comparable_adjective": end_nodes.comparable_adjective || [],
        "comparative_adjective": end_nodes.comparative_adjective || [],
        "superlative_adjective": end_nodes.superlative_adjective || [],
    
        // Adverbs
        "adverb": end_nodes.adverb || [],
        
        // Verbs
        "verb": end_nodes.verb || [],
        "pasttense_verb": end_nodes.pasttense_verb || [],
        "presenttense_verb":  end_nodes.presenttense_verb || [],
    
        // Prepositions
        "preposition": end_nodes.preposition || [],
        
        // Conjunctions
        "conjunction": end_nodes.conjunction || [],
    
        // Determiners
        "determiner": end_nodes.determiner || [],
    
        // Question words
        "questionword": end_nodes.questionword || [],
    }
}

function count_line_sylls(line) {
    const words = line.split(" ");
    let sylls = 0;
    for (let i = 0; i < words.length; i += 1) {
        const word = words[i];
        sylls += count_word_sylls(word)
    }
    return sylls;
}

// TODO(anna): this needs some tuning.
function count_word_sylls(word) {
    word = word.toLowerCase();
    if (word.length <= 3) { return 1; }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    return word.match(/[aeiouy]{1,2}/g).length;
}

function create_line(grm, origin, sylls, tries) {
    const generator = tracery.createGrammar(grm);
    console.log(generator);
    let line = "";
    for (let i = 0; i < tries; i += 1) {
        line = generator.flatten(origin);
        if (count_line_sylls(line) === sylls) {
            return `${line} (${count_line_sylls(line)})`;
        }
    }
    return "blah ".repeat(sylls)
}

function haiku(alt_txt) {
    // Get end nodes from alt text
    const end_nodes = get_end_nodes(alt_txt);
    console.log(end_nodes);

    // Create the grammar
    const grm = create_grm(end_nodes);

    // Initialize the haiku
    let haiku = "";

    // Generate the haiku, line by line
    haiku += `${create_line(grm, "#l1#", 5, 40)}<br/>`;
    haiku += `${create_line(grm, "#l2#", 7, 40)}<br/>`;
    haiku += `${create_line(grm, "#l3#", 5, 40)}<br/>`;

    // Write to DOM
    const haikuDiv = document.createElement("div");
    haikuDiv.style = "margin: 10%; line-height: 1;";
    haikuDiv.innerHTML = haiku;
    
    document.body.insertAdjacentElement("beforeend", haikuDiv);
}

// setTimeout(haiku, 10);