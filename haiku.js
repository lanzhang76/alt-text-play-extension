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
        "l1": ["#NP#"],
        "l2": ["and #NP#"],
        "l3": ["and #NP#"],
    
        // Nouns
        "NP": ["#AP# #N#", "#N#"],
        "N": ["#noun#", "#noun_plural#", "#noun_singular#", "#uncountable_noun#"],
        "noun": end_nodes.noun || ["blah"],
        "noun_plural": end_nodes.noun_plural || ["blah"],
        "noun_singular": end_nodes.noun_singular || ["blah"],
        "uncountable_noun":  end_nodes.uncountable_noun || ["blah"],
    
        // Adjectives
        "AP": [ "#adjective#", "#comparable_adjective#", "#adjective#, #adjective#"],
        "adjective": end_nodes.adjective || ["blah"],
        "comparable_adjective": end_nodes.comparable_adjective || ["blah"],
        "comparative_adjective": end_nodes.comparative_adjective || ["blah"],
        "superlative_adjective": end_nodes.superlative_adjective || ["blah"],
    
        // Adverbs
        "adverb": end_nodes.adverb || ["blah"],
        
        // Verbs
        "verb": end_nodes.verb || ["blah"],
        "pasttense_verb": end_nodes.pasttense_verb || ["blah"],
        "presenttense_verb":  end_nodes.presenttense_verb || ["blah"],
    
        // Prepositions
        "preposition": end_nodes.preposition || ["blah"],
        
        // Conjunctions
        "conjunction": end_nodes.conjunction || ["blah"],
    
        // Determiners
        "determiner": end_nodes.determiner || ["blah"],
    
        // Question words
        "questionword": end_nodes.questionword || ["blah"],
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
    return "blah ".repeat(sylls);
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
    haiku += `${create_line(grm, "#l1#", 5, 100)}<br/>`;
    haiku += `${create_line(grm, "#l2#", 7, 100)}<br/>`;
    haiku += `${create_line(grm, "#l3#", 5, 100)}<br/>`;

    // Write to DOM
    // const haikuDiv = document.createElement("div");
    // haikuDiv.style = "margin: 10%; line-height: 1;";
    altHaiku.innerHTML = haiku;
}

// setTimeout(haiku, 10);