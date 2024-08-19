// Code goes here!
//project state management

class ProjectState {
    private listeners: any[] = []
    private projects: any[] = []
    private static instance: ProjectState
   

    private constructor() {

    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        }

        this.instance = new ProjectState()
        return this.instance
    }

    projectsList() {
        // console.log(this.projects)
    }

    addListener(listenerFn: Function) {
        this.listeners.push(listenerFn)
    }

    addProject(title:string, description:string, numOfPeople:number) {
        const newProject = {
            id: Math.random().toString(),
            title:title,
            description:description,
            people:numOfPeople
        }

        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())//<-this.projects.slice was passed to projects list when addListeners was called
        }
    }

}

const projectState = ProjectState.getInstance()
//validation
interface Validatable  {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?:number;
    max?:number
}

function validate(validatableInput: Validatable) {

    let isValid = true
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid
}

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

class ProjectList {
    templateElement:HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLElement
    assignedProjects:any[]

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement
        this.assignedProjects = []
        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLElement 
        this.element.id = `${this.type}-projects`
        //this is the listeners to add the projects to the list
        projectState.addListener((projects: any[]) => {
            this.assignedProjects = projects
            this.renderProjects()
        })


        this.attach()
        this.renderContent()
    }

    private renderProjects() {
        console.log(this.assignedProjects)
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        projectState.projectsList()
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement('li')
            listItem.textContent = projectItem.title
            listEl?.appendChild(listItem)
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects'
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
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

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const titleValidatable:Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable:Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable:Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            !validate(titleValidatable) || 
            !validate(descriptionValidatable) || 
            !validate(peopleValidatable)) 
        {
            alert('Invalid input try again')
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInput() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()

        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput
            projectState.addProject(title, description, people)
            this.clearInput()
        }
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
const activeProjectList = new ProjectList('active')
const inactiveProjectList = new ProjectList('finished')