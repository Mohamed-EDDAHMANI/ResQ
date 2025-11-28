import { render, screen } from '@testing-library/react';
import CriticalAlert from '../CriticalAlert';

const mockIncidents = [
  {
    id: 1,
    type: 'Crise cardiaque',
    severity: 'critical',
    status: 'pending',
    address: 'Maarif, Casablanca',
    lat: 33.586,
    lng: -7.62,
    patient: 'Femme, 60 ans',
    assignedAmbulanceId: null,
    createdAt: '2025-01-01T12:05:00Z',
    updatedAt: '2025-01-01T12:05:00Z'
  },
  {
    id: 2,
    type: 'Accident',
    severity: 'high',
    status: 'pending',
    address: 'Casa',
    lat: 33.586,
    lng: -7.62,
    patient: 'Homme, 30 ans',
    assignedAmbulanceId: null,
    createdAt: '2025-01-01T12:05:00Z',
    updatedAt: '2025-01-01T12:05:00Z'
  }
];

describe('CriticalAlert', () => {
  test('shows alert when there are critical pending incidents', () => {
    render(<CriticalAlert incidents={mockIncidents} />);
    
    expect(screen.getByText('ALERTE - INCIDENT CRITIQUE')).toBeInTheDocument();
    expect(screen.getByText('Nouvel incident critique nécessitant une intervention immédiate')).toBeInTheDocument();
  });

  test('does not show alert when no critical pending incidents', () => {
    const nonCriticalIncidents = mockIncidents.map(incident => ({
      ...incident,
      severity: 'low'
    }));
    
    const { container } = render(<CriticalAlert incidents={nonCriticalIncidents} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('does not show alert when critical incidents are not pending', () => {
    const completedIncidents = mockIncidents.map(incident => ({
      ...incident,
      status: 'completed'
    }));
    
    const { container } = render(<CriticalAlert incidents={completedIncidents} />);
    
    expect(container.firstChild).toBeNull();
  });
});