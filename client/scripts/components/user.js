const User = {

  id: null,
  name: null,
  color: null,

  setProps: function setProps(obj) {

    Object.keys(obj).forEach(key => {

      this[key] = obj[key];

    });

  },

};

export default User;
