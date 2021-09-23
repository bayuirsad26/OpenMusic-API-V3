/**
 * To be responsible of listener.
 */
class Listener {
  /**
   * Construct to get access into notes service and mail sender.
   * @param {*} notesService Param represent of notes service.
   * @param {*} mailSender Param represent of mail sender.
   */
  constructor(notesService, mailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  /**
   * Listen.
   * @param {*} message Param represent of message.
   */
  async listen(message) {
    try {
      const {userId, targetEmail} = JSON.parse(message.content.toString());

      const notes = await this._notesService.getNotes(userId);
      const result = await this._mailSender.sendEmail(
          targetEmail, JSON.stringify(notes),
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
