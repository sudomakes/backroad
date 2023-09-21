import { BackroadComponent } from "../../base";


export class MarkdownComponent extends BackroadComponent<{body:string|number}>{
    constructor(props:{key:string, body: MarkdownComponent["args"]["body"]}){
        super({key:props.key,type: "markdown"})
        this.args = {body:props.body}
    }   
}