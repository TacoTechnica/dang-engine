
export enum PopupType {
    Normal,
    Warning,
    Error
}

/**
 * Logger
 * 
 * Controls logging and user notification of the app's status
 * 
 */
export default class Logger {
    private static _alertBox : HTMLElement;

    public static init(alertsElement : string) {
        Logger._alertBox = document.getElementById(alertsElement) as HTMLCanvasElement;
    }


    public static popup(message : string, popupType : PopupType = PopupType.Normal) : void{
        new Logger.Alert(this._alertBox, message, popupType).popup();
    }

    // Wrappers for now, but now we can add more features to this later.
    public static logMessage(...data : any[]) : void {
        console.info(...data);
    }
    public static logDebug(...data : any[]) : void {
        console.log(...data);
    }
    public static logError(...data : any[]) : void {
        console.error(...data);
    }
    public static logWarning(...data : any[]) : void {
        console.warn(...data);
    }

    private static onDebugOpen() : void {
        // TODO: Hook up and add extra debug stuff
    }
    private static onDebugClosed() : void {
        // TODO: Hook up and delete debug stuff
    }


    static Alert = class {
        private _alertBox : HTMLElement;
        private _popup : HTMLElement;
        private _message : string;
        private _popupType : PopupType;

        constructor(alertBox : HTMLElement, message : string, popupType : PopupType) {
            this._alertBox = alertBox;
            this._message = message;
            this._popupType = popupType;
        }

        public popup() : void {
            this._popup = this.createPopup(this._message);
            let closeButton = this.createCloseButton();
            this._popup.appendChild(closeButton);
            this._alertBox.appendChild(this._popup);
            closeButton.onclick = (event) => {
                this.close();
            };
        }
        public close() : void {
            this._alertBox.removeChild(this._popup);
        }

        private createCloseButton() : HTMLElement {
            let button = document.createElement("button");
            button.innerHTML = "X"; // TODO: Icon
            button.style.position = "relative";
            button.style.float = "right";
            button.style.top = "0px";
            button.style.right = "0px";
            button.style.padding = "0px";
            button.style.width = "20px";
            button.style.height = "20px";
            return button;
        }
        private createPopup(message : string) : HTMLElement {
            let popup = document.createElement("div");
            popup.className = "alert";
            popup.innerHTML = message;
            popup.style.overflow = "auto";
            let color : string;
            switch (this._popupType) {
                case PopupType.Normal:
                    color = "gray";
                    break;
                case PopupType.Warning:
                    color = "yellow";
                    break;
                case PopupType.Error:
                    color = "red";
                    break;
            }
            popup.style.border = "3px solid " + color;
            return popup;
        }
    };
}