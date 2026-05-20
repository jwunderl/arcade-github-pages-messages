//% block="Parent Frame"
//% color="#7B1FA2" weight=100 icon="\uf2d2"
namespace parentFrame {
    /**
     * Sends a text message to the parent frame on the given channel.
     * @param channel the channel to send the message on, eg: "default"
     * @param message the text message to send, eg: "hello"
     */
    //% blockId=parentframe_send_message
    //% block="send parent frame message %message on channel %channel"
    //% weight=90
    //% blockGap=8
    //% channel.defl="default"
    //% message.defl="hello"
    export function sendMessage(channel: string, message: string) {
        if (message == null) return;
        const msgBuffer = Buffer.fromUTF8(message);
        control.simmessages.send(channel, msgBuffer, true);
    }

    /**
     * Runs code when a text message is received from the parent frame on the given channel.
     * @param channel the channel to listen on, eg: "default"
     * @param handler the code to run when a message is received
     */
    //% blockId=parentframe_on_receive_message
    //% block="on parent frame message received on channel %channel"
    //% weight=80
    //% draggableParameters="reporter"
    //% channel.defl="default"
    export function onReceiveMessage(channel: string, handler: (message: string) => void) {
        control.simmessages.onReceived(channel, buf => {
            handler(buf.toString());
        });
    }
}