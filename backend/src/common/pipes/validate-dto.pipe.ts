import { BadRequestException, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

function processValidationErrors(errors: ValidationError[], parentFieldName: string = ''): string[] {
  return errors.map((err) => {
    const currentFieldName = parentFieldName ? `${parentFieldName}.${err.property}` : err.property;
    if (err.children && err.children.length) return processValidationErrors(err.children, currentFieldName).join(', ');
    const errorMessages = err.constraints ? Object.values(err.constraints) : [];
    const fieldName = mapFieldName(currentFieldName);
    return errorMessages.map((msg) => msg.replace(err.property, fieldName)).join(', ');
  });
}
export function createValidationPipe(options?: ValidationPipeOptions): ValidationPipe {
  return new ValidationPipe({
    ...options,
    exceptionFactory: (errors) => {
      console.log(errors);
      const messages = errors.map((err) => {
        console.log(err);
        let errorMessages = [];
        if (err.constraints) {
          errorMessages = Object.values(err.constraints);
        }
        if (err.children && err.children.length) {
          errorMessages = processValidationErrors(err.children, err.property);
          console.log({ errorMessages });
        }
        //errorMessages = processValidationErrors(err);
        const fieldName = mapFieldName(err.property);
        if (fieldName) return errorMessages.map((msg) => msg.replace(err.property, fieldName)).join(', ');

        return errorMessages.join(', ');
      });

      return new BadRequestException(messages);
    },
  });
}

function mapFieldName(fieldName: string): string {
  const customFieldNames: { [key: string]: string } = {
    //User
    firstName: 'First name',
    lastName: 'Last name',
    newPassword: 'Password',
    confirmPassword: 'Confirm password',
    email: 'Email',

    //Profile
    dob: 'Date of birth',
    bio: 'Bio',
    gender: 'Gender',
    phoneNo: 'Phone Number',

    //Store
    storeName: 'Store name',
    websiteUrl: 'Website url',
    storePhone: 'Store phone number',
    stateName: 'State name',
    street: 'Street',
    stateShortCode: 'State short code',
    city: 'City',
    longitude: 'Longitude',
    latitude: 'Latitude',

    //Product
    sku: 'Product sku',
    productName: 'Product name',
    volume: 'Volume',
    productDescription: 'Product description',
    battery: 'Battery',
    productImage: 'Product image',

    //Product Filter
    minSku: 'Minimum product sku',
    maxSku: 'Maximum product sku',
    minVolume: 'Minimum product volume',
    maxVolume: 'Maximum product volume',
    minRating: 'Minimum product rating',
    maxRating: 'Maximum product rating',
    minPrice: 'Minimum product price',
    maxPrice: 'Maximum product price',

    //Flavor
    flavorName: 'Flavor name',
    barCode: 'Flavor barcode',
    flavorShortCode: 'Flavor short code',

    //Category
    status: 'Status',
    rating: 'Rating',
    productId: 'Product id',
    flavorId: 'Flavor id',
    price: 'Price',

    //Review
    content: 'Comment',
  };

  return customFieldNames[fieldName] || fieldName;
}
