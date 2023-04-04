import {
    IAppAccessors,
    ILogger,
    IHttp,
    IRead,
    IPersistence
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPreMessageSentPrevent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

export class AiModerationApp extends App implements IPreMessageSentPrevent{
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePreMessageSentPrevent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean> {

        const options = {
            headers: {
                'content-type': 'application/json',
            },
            data: {
                "value": message.text
            },
        };
        
        
        const url = "https://6000-abelaba-rocketchat-njdjd6p2rf3.ws-eu93.gitpod.io/api/toxicity"
        const response = await http.post(`${url}`, options);

        if(response.data.isToxic){
            read.getNotifier().notifyUser(message.sender, {
                room: message.room,
                sender: message.sender,
                text: "The message you have sent is inappropriate!",
                alias: 'Photos & Links Filter',
                emoji: ':no_entry:',
            });
            return true;
        }
        
        return false;
 
    }
}
