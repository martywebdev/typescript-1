// Code goes here!

//decorators

function autobind(_target: any, _method:string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor:PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

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

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        console.log(this.titleInputElement.value)
    }

    private configure() {
        //binding to the class!
        // this.element.addEventListener('submit', this.submitHandler.bind(this))
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const projectInput = new ProjectInput()