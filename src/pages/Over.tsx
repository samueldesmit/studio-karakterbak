import logoPng from '../assets/Logo studio.png';
import './Over.css';

export default function Over() {
  return (
    <div className="over">
      <img src={logoPng} alt="" className="page-bg-logo" aria-hidden="true" />
      <h1>Over</h1>
      <div className="over-content">
        <div className="over-text">
          <p>
            Maurits is de creatieve kracht achter Studio Karakterbak. Met een passie voor muziekproductie, mixing en mastering brengt hij elk project tot leven met een uniek en herkenbaar geluid.
          </p>
          <p>
            Met jarenlange ervaring in de studio combineert Maurits technische precisie met een artistieke visie. Of het nu gaat om het produceren van een track vanaf nul, het mixen van een volledige plaat of het masteren van de laatste details — elk project krijgt de aandacht die het verdient.
          </p>
          <p>
            Bij Studio Karakterbak draait alles om samenwerking. Maurits gelooft dat de beste muziek ontstaat wanneer artiesten zich thuis voelen in de studio en de ruimte krijgen om te experimenteren. Het resultaat? Muziek met karakter.
          </p>
        </div>
        <div className="over-image">
          <img src="/uploads/DSC00186.JPG" alt="Maurits" />
        </div>
      </div>
    </div>
  );
}
