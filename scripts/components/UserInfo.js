export default class UserInfo {
  constructor({ nameSelector, jobSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._avatarElement = avatarSelector
      ? document.querySelector(avatarSelector)
      : null;
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    };
  }

  setUserInfo({ name, job, avatar }) {
    if (this._nameElement) this._nameElement.textContent = name;
    if (this._jobElement) this._jobElement.textContent = job;

    if (avatar && this._avatarElement) {
      this._avatarElement.src = avatar;
      this._avatarElement.alt = `Avatar de ${name}`;
    }
  }
}
