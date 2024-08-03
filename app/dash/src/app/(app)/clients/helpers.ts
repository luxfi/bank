import { IClients } from '@/models/clients';

import { IClientsFilters } from './types';

export const filterClientsTable = (
  originalArray: Array<IClients>,
  filters: IClientsFilters,
  search: string = ''
) => {
  const {
    entityType = '',
    country = '',
    riskRating = '',
    PEP = '',
    gateway = '',
  } = filters;

  return originalArray
    .map((item) => {
      const filteredClients = item?.clients?.filter((client) => {
        const clientMatchesSearch = () => {
          const searchLower = search.toLowerCase();
          const usernameMatches = item.username
            .toLowerCase()
            .includes(searchLower);

          const companyNameMatches =
            client.account?.businessMetadata?.companyName
              ?.toLowerCase()
              .includes(searchLower) || false;

          const firstNameMatches =
            client.account?.individualMetadata?.firstname
              ?.toLowerCase()
              .includes(searchLower) || false;

          const lastNameMatches =
            client.account?.individualMetadata?.lastname
              ?.toLowerCase()
              .includes(searchLower) || false;

          return (
            usernameMatches ||
            companyNameMatches ||
            firstNameMatches ||
            lastNameMatches
          );
        };

        const clientMatchesFilters = () => {
          const countryMatches = () => {
            const individualCountry =
              client.account?.individualMetadata?.country;

            const businessCountry =
              client.account?.businessMetadata?.countryOfRegistration;

            return (
              (individualCountry &&
                individualCountry
                  .toLowerCase()
                  .includes(country.toLowerCase())) ||
              (businessCountry &&
                businessCountry.toLowerCase().includes(country.toLowerCase()))
            );
          };

          const entityTypeMatches = client.account?.entityType
            ?.toLowerCase()
            .includes(entityType.toLowerCase());

          const pepMatches = client.account?.riskAssessments[0]?.pep
            ?.toLowerCase()
            .includes(PEP.toLowerCase());

          const ratingMatches = () => {
            let rating = client.account?.riskAssessments[0]?.rating;
            if (!rating) rating = 'pending';
            return rating.toLowerCase().includes(riskRating.toLowerCase());
          };

          const gatewayMatches = () => {
            let gatewayField = client.account?.gateway;
            if (!gatewayField) gatewayField = 'Unlinked';
            return gatewayField.toLowerCase().includes(gateway.toLowerCase());
          };

          return (
            (!country || countryMatches()) &&
            (!entityType || entityTypeMatches) &&
            (!PEP || pepMatches) &&
            (!riskRating || ratingMatches()) &&
            (!gateway || gatewayMatches())
          );
        };

        if (search) {
          return clientMatchesSearch();
        }

        return clientMatchesFilters();
      });

      if (filteredClients && filteredClients.length > 0) {
        return { ...item, clients: filteredClients };
      }

      return null as any;
    })
    .filter((item) => item !== null);
};
