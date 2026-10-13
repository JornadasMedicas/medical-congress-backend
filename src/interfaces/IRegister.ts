export interface WorkshopsFormInterface {
    checked: boolean;
    name: string;
}

export interface PropsTalleresInterface {
    asistio: boolean;
    constancia_enviada: boolean;
    id_taller: number;
    nombre?: string;
}

export interface PropsSendRegistMailInterface {
    categoria: string;
    acronimo: string;
    nombre: string;
    apellidos: string;
    rfc?: string;
    tel: string;
    ciudad: string;
    dependencia?: string;
    isPreRegist: boolean;
    correo: string;
    modulo: number;
    talleres: PropsTalleresInterface[];
    edicion: number;
    recaptchaToken: string;
}
