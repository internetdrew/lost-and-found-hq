export const INPUT_LENGTHS = {
  location: {
    name: {
      min: 1,
      max: 45,
    },
    streetAddress: {
      min: 1,
      max: 45,
    },
    city: {
      min: 1,
      max: 45,
    },
  },
  item: {
    name: {
      min: 1,
      max: 25,
    },
    foundAt: {
      min: 1,
      max: 25,
    },
    briefDescription: {
      min: 1,
      max: 150,
    },
    staffDetails: {
      min: 1,
      max: 150,
    },
  },
  itemClaim: {
    itemDetails: {
      min: 1,
      max: 250,
    },
  },
};
