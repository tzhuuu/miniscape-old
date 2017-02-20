class CharacterStore{

  constructor(){
    this.characters = {};
  }

  addCharacter(name, character){
    this.characters[name] = character;
  }
  getCharacter(name) {
    return this.characters[name];
  }
}

var instance = new CharacterStore();
Object.freeze(instance);
module.exports = instance;