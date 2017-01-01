import {Editor} from './editor';
import {commands} from 'vscode';
export class Operation {
    private editor: Editor;
    private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();
        this.commandList = {
            'C-k': () => {
                this.editor.kill();
            },
            'C-w': () => {
                if (this.editor.cut()) {
                    this.editor.setStatusBarMessage("Cut");
                } else {
                    this.editor.setStatusBarMessage("Cut Error!");
                }
            },
            'M-w': () => {
                if (this.editor.copy()) {
                    this.editor.setStatusBarMessage("Copy");
                } else {
                    this.editor.setStatusBarMessage("Copy Error!");
                }
            },
            'C-y': () => {
                if(this.editor.yank()) {
                    this.editor.setStatusBarMessage("Yank");
                } else {
                    this.editor.setStatusBarMessage("Kill ring is empty");
                }
            },
            "C-x_C-o": () => {
                this.editor.deleteBlankLines();
            },
            "C-x_u": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            "C-/": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            'C-g': () => {
                this.editor.setStatusBarMessage("Quit");
            },
            "C-x_r": () => {
                this.editor.setRMode();
            },
            "M-y": () => {
                let that = this;
                this.editor.yankPop().then(function(result) {
                    if (result) {
                        that.editor.setStatusBarMessage("Yank Pop");
                    } else {
                        that.editor.setStatusBarMessage("Previous command was not a yank");
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            },
            "backspace": () => {
                commands.executeCommand("deleteLeft").then(() => {
                    commands.executeCommand("emacs.exitMarkMode");
                });
            }
        };
    }

    getCommand(commandName: string): (...args: any[]) => any {
        return this.commandList[commandName];
    }

    onType(text: string): void {
        this.editor.onType(text);
    }
}
