
import { API_URL } from '@/constants/api';
import { ScientificEvent, EventFormData, ScientificEventApiResponse, SingleScientificEventApiResponse } from '../types';

export class ScientificEventsService {
  private static baseUrl = `${API_URL}/api/scientific-events`;

  static async getAllEvents(): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      console.log(data.data)

      return data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  static async getEventById(id: string): Promise<ScientificEvent> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleScientificEventApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }

  static async getEventByName(name: string, year: number): Promise<ScientificEvent> {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await fetch(`${this.baseUrl}/by-name/${encodedName}/year/${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleScientificEventApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching event ${name} (${year}):`, error);
      throw error;
    }
  }

  static async getEventsByYear(year: number): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/year/${year}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching events for year ${year}:`, error);
      throw error;
    }
  }

  static async getActiveEvents(): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching active events:', error);
      throw error;
    }
  }

  static async getCurrentEvents(): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/current`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching current events:', error);
      throw error;
    }
  }

  static async getEventsByDateRange(startDate: string, endDate: string): Promise<ScientificEvent[]> {
    try {
      const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
      const response = await fetch(`${this.baseUrl}/date-range?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching events from ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

  static async createEvent(eventData: EventFormData): Promise<ScientificEvent> {
    try {
      const payload = {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        year: eventData.year,
        start_date: eventData.start_date ? new Date(eventData.start_date).toISOString() : null,
        end_date: eventData.end_date ? new Date(eventData.end_date).toISOString() : null,
        submission_deadline: eventData.submission_deadline ? new Date(eventData.submission_deadline).toISOString() : null,
        //id_path_drive_file: eventData.id_path_drive_file || '',
        id_path_drive_file_poster: eventData.id_path_drive_file_poster || '',
        id_path_drive_file_gallery: eventData.id_path_drive_file_gallery || '',
        is_active: eventData.is_active,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data: SingleScientificEventApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  static async updateEvent(id: string, eventData: EventFormData): Promise<ScientificEvent> {
    try {
      const payload = {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        year: eventData.year,
        start_date: eventData.start_date ? new Date(eventData.start_date).toISOString() : null,
        end_date: eventData.end_date ? new Date(eventData.end_date).toISOString() : null,
        submission_deadline: eventData.submission_deadline ? new Date(eventData.submission_deadline).toISOString() : null,
        id_path_drive_file: eventData.id_path_drive_file || '',
        id_path_drive_file_poster: eventData.id_path_drive_file_poster || '',
        id_path_drive_file_gallery: eventData.id_path_drive_file_gallery || '',
        is_active: eventData.is_active,
      };

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data: SingleScientificEventApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  }

  static async activateEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/activate`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }
    } catch (error) {
      console.error(`Error activating event ${id}:`, error);
      throw error;
    }
  }

  static async deactivateEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/deactivate`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }
    } catch (error) {
      console.error(`Error deactivating event ${id}:`, error);
      throw error;
    }
  }

  // Métodos adicionales útiles para la gestión de eventos científicos

  static async getUpcomingEvents(): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/upcoming`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  static async getEventsByLocation(location: string): Promise<ScientificEvent[]> {
    try {
      const encodedLocation = encodeURIComponent(location);
      const response = await fetch(`${this.baseUrl}/location/${encodedLocation}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching events by location ${location}:`, error);
      throw error;
    }
  }

  static async searchEvents(query: string): Promise<ScientificEvent[]> {
    try {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${this.baseUrl}/search?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error searching events with query ${query}:`, error);
      throw error;
    }
  }

  static async getEventsWithSubmissionDeadline(): Promise<ScientificEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/with-deadline`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScientificEventApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching events with submission deadline:', error);
      throw error;
    }
  }

  static async getEventStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    upcoming: number;
    withDeadlines: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/statistics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching event statistics:', error);
      throw error;
    }
  }
}