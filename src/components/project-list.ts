import { autobind } from "../decorators/autobind.js"
import { DragTarget } from "../model/drag-drop.js"
import { Project, ProjectStatus } from "../model/project.js"
import { projectState } from "../state/project-state.js"
import { Component } from "./base-component.js"
import { ProjectItem } from "./project-item.js"

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects:Project[]

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        
        this.assignedProjects = []      
        this.configure()
        this.renderContent()
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault()
            const listEl = this.element.querySelector('ul')!
            listEl?.classList.add('droppable')
        }
        
    }   

    @autobind
    dropHandler(event: DragEvent): void {
        const projectId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)

    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!
        listEl?.classList.remove('droppable')
    }

    configure() {        
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        //this is the listeners to add the projects to the list
        projectState.addListener((projects: Project[]) => {
            //filtering
            const relevantProjects = projects.filter(project => { 
                if (this.type === 'active') {                    
                    return project.status === ProjectStatus.Active
                }
                return project.status === ProjectStatus.Finished            
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects'
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const projectItem of this.assignedProjects) {
            // const listItem = document.createElement('li')
            // listItem.textContent = projectItem.title
            // listEl?.appendChild(listItem)
            new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
        }
    }
}