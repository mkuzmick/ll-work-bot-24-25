// get slash command content, for now get name from string before colon, descript from string after colon?
// or modal after /pokemon [name] that asks for description

module.exports.pokemonImageGenerator = require('./pokemon-image-generator');
module.exports.pokemonFormView = require('./pokemon-form-view');
module.exports.pokemonDescriptionFromImage = require('./pokemon-description-from-image');
module.exports.pokemonImageToSlack = require('./pokemon-image-to-slack');
module.exports.pokemonStructuredData = require('./pokemon-structured-data');

module.exports.slash = require('./pokemon-slash');
module.exports.viewSubmission = require('./pokemon-view-submission');