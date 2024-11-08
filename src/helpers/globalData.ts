import moment from "moment";
moment.locale('es-mx');

//!IMPORTANT UPDATE EVERY YEAR
//Files: emailsData | assistantsQueries
export const registerDay1 = moment(`${moment().format('YYYY')}-11-21`);
export const registerDay2 = moment(`${moment().format('YYYY')}-11-22`);
export const registerDay3 = moment(`${moment().format('YYYY')}-11-23`);
export const dateT1 = moment(`${moment().format('YYYY')}-11-22 08:00:00`);
export const dateT2 = moment(`${moment().format('YYYY')}-11-22 15:30:00`);
export const dateT3 = moment(`${moment().format('YYYY')}-12-20`);
export const dateT4 = moment(`${moment().format('YYYY')}-12-20`);
export const dnow = moment(`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`);
export const dnowWorkshops = moment();
export const edition: number = 1; //match id's from jrn_edicion table