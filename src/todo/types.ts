
export interface TodoItem {
    id: string;
    todoText: string;
    isDone: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Owner {
    id: number;
    name: string;
    course_id: number;
    section_id: number;
}