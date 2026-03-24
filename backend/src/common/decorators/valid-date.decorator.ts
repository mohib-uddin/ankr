import { registerDecorator } from "class-validator";
// import * as moment from "moment/moment";
import moment from 'moment-timezone';
import { DateConstants } from "@constants";


export function IsValidDate(validationOptions?: { message?: string }) {
  return function(object: Object, propertyName: string) {
    const { message } = validationOptions || {};

    registerDecorator({
      name: "IsValidDate",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: message || `Invalid date format. Use ${DateConstants[0]}`
      },
      validator: {
        validate(value: any) {
          return moment(value, DateConstants[0], true).isValid();
        }
      }
    });
  };
}

