class Security {
  constructor() {
    this.permissionMethod = new Map();
  }

  loadPermissions() {}

  hasPermission(req) {
    let key = `${req.session.profile_id}_${req.body.objectName}_${req.body.methodName}`;
    if (this.permissionMethod.has(key)) {
      return this.permissionMethod.get(key);
    } else {
      return false;
    }
  }

  exeMethod(jsonData) {}
}

module.exports = Security;
