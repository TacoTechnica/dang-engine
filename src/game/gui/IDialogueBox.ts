
/**
 * If you want to use your custom dialog box, implement this and replace the game's current one.
 */
export interface IDialogueBox {
    /**
     * Starts up a dialogue and sees it through the end using coroutines.
     * @param name The name of the Speaker. "" if there is no speaker.
     * @param text The text to be displayed.
     */
    runDialogue(name : string, text : string) : IterableIterator<any>;

    /**
     * Closes the dialog box.
     */
    close() : void;

}
