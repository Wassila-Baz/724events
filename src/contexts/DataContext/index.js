import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// Création d'un contexte pour stocker et partager les données à travers l'application
const DataContext = createContext({});

// API fictive qui simule le chargement de données à partir d'un fichier JSON
export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

// Component DataProvider : Fournit les données à l'ensemble de l'application via le contexte
export const DataProvider = ({ children }) => {
  // État local pour stocker les éventuelles erreurs lors du chargement des données
  const [error, setError] = useState(null);
  // État local pour stocker les données chargées à partir de l'API
  const [data, setData] = useState(null);

  // Fonction asynchrone pour charger les données à partir de l'API
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  // Tri des événements par date dans l'ordre décroissant
const events = data?.events;
const sortedEvents = events?.sort((evtA, evtB) => new Date(evtA.date) > new Date(evtB.date) ? -1 : 1);
const last = sortedEvents?.[0];
    // Effet useEffect pour déclencher le chargement des données lorsqu'il n'y en a pas encore
  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
// Spécification des types de propriétés attendues par DataProvider
DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
// Hook useData : Permet aux composants enfants de consommer les données depuis le contexte
export const useData = () => useContext(DataContext);
// Export par défaut du contexte (pas nécessaire, exportez plutôt le DataProvider)
export default DataContext;