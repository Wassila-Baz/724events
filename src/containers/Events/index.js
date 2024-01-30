import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

// Nombre d'événements à afficher par page
const PAR_PAGE = 9;

const EventListe = () => {
  // Récupérer les données et l'état d'erreur en utilisant le hook personnalisé
  const { data, error } = useData();
  const [type, setType] = useState(); // État pour gérer le type d'événement sélectionné et la page actuelle
  const [pageActuelle, setPageActuelle] = useState(1);

  // Fonction pour changer le type d'événement sélectionné
  const changerType = (typeEvt) => {
    setPageActuelle(1);
    setType(typeEvt);
  };

  // Filtrer les événements en fonction du type sélectionné et de la page actuelle
  const filteredEvents = (
    type
      ? data?.events.filter(event => event.type === type)
      : data?.events
  ) || [];

  // Applique la pagination sur les événements filtrés
  const paginatedEvents = filteredEvents.slice(
    (pageActuelle - 1) * PAR_PAGE,
    pageActuelle * PAR_PAGE
  );

  // Calculer le nombre total de pages en fonction des événements filtrés
  const nombreDePages = Math.floor((filteredEvents?.length || 0) / PAR_PAGE) + 1;

  // Extraire les types d'événements uniques à l'aide d'un ensemble (Set)
  const typeList = new Set((data?.events || []).map((event) => event.type));

  return (
    <>
      {/* Afficher un message d'erreur s'il y a une erreur */}
      {error && <div>Une erreur est survenue</div>}

      {/* Afficher un message de chargement pendant le chargement des données */}
      {data === null ? (
        "Chargement"
      ) : (
        <>
          {/* Afficher le titre de la sélection de catégorie */}
          <h3 className="SelectTitle">Catégories</h3>

          {/* Liste déroulante pour sélectionner les types d'événements */}
          <Select
            selection={Array.from(typeList)}
            onChange={(valeur) => (valeur ? changerType(valeur) : changerType(null))}
          />

          {/* Afficher la liste des événements */}
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              // Envelopper chaque carte d'événement avec un modal
              <Modal key={event.id} Content={<ModalEvent evenement={event} />}>
                {/* Rendre la carte d'événement à l'intérieur du modal */}
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          {/* Afficher les liens de pagination */}
          <div className="Pagination">
            {[...Array(nombreDePages || 0)].map((_, n) => (
              // Rendre les liens de pagination
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setPageActuelle(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventListe;
