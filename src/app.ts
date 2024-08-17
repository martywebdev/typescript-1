// Code goes here!

class ProjectInput {

    templateElement:HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement // this is the form
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement // form node
        this.element.id = 'user-input'

        // form inputs
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement 
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement

        this.configure()
        this.attach()
    }

    private submitHandler(event: Event) {
        event.preventDefault()
        console.log(event.target)
        console.log(this.titleInputElement.value)
    }

    private configure() {
        //binding to the class!
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const projectInput = new ProjectInput()