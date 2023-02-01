class AuthorDTO {
  constructor(id, nombre, apellido, edad, alias, avatar) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.alias = alias;
    this.avatar = avatar;
  }
}

class MessageDTO {
  constructor(author, text) {
    this.author = author;
    this.text = text;
  }
}

module.exports = { AuthorDTO, MessageDTO };
