export interface WorkshopsFormInterface {
    checked: boolean;
    name: string;
}

export interface PropsSendRegistMailInterface {
    categoria: string;
    acronimo: number;
    nombre: string;
    apellidos: string;
    rfc?: string;
    correo: string;
    tel: number;
    ciudad: string;
    dependencia?: string;
    modulo?: string;
    t1: WorkshopsFormInterface;
    t2: WorkshopsFormInterface;
    t3: WorkshopsFormInterface;
    t4: WorkshopsFormInterface;
}
