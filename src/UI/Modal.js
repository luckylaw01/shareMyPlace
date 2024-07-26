export class Modal {
    constructor(contentId, fallbackText){
        this.fallbackText = fallbackText;
        this.contentTemplateEl = document.getElementById(contentId);
        this.modalTemplateEl = document.getElementById('modal-template');
    }

    show(){
        if('content' in document.createElement('template')){
            this.modalElements = document.importNode(this.modalTemplateEl.content, true);
            this.modalElement = this.modalElements.querySelector('.modal');
            this.backdropElement = this.modalElements.querySelector('.backdrop');
            const contentElelment = document.importNode(this.contentTemplateEl.content, true);

            this.modalElement.appendChild(contentElelment);

            document.body.insertAdjacentElement('afterbegin', this.modalElement);
            document.body.insertAdjacentElement('afterbegin', this.backdropElement);
        }   
        else{
            //fallback code
            alert(this.fallbackText);
        }
    }
    hide(){

        if(this.modalElement){
            document.body.removeChild(this.modalElement);
            document.body.removeChild(this.backdropElement);

            this.modalElement = null;
            this.backdropElement = null;
        }

    }
}