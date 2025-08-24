'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default function CalendarPage() {
  const router = useRouter();
  const [medications, setMedications] = useState([]);
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    

    
    setMedications([]);
    
    
    const medicationEvents = medications.flatMap(med => {
      return createEventsFromMedication(med);
    });
    
    setEvents(medicationEvents);
  }, [medications.length]); 
  
  
  const createEventsFromMedication = (med) => {
    const events = [];
    
    
    switch(med.frequency) {
      case 'daily':
        
        med.timeOfDay.forEach(time => {
          events.push({
            id: `${med.id}-${time}`,
            title: `${med.name} ${med.dosage}`,
            startTime: time,
            endTime: getEndTime(time),
            startRecur: med.startDate,
            endRecur: med.endDate || null,
            daysOfWeek: [0,1,2,3,4,5,6], 
            backgroundColor: getColorForMedication(med.id),
            extendedProps: { medication: med }
          });
        });
        break;
        
      case 'weekly':
        
        med.timeOfDay.forEach(time => {
          events.push({
            id: `${med.id}-${time}`,
            title: `${med.name} ${med.dosage}`,
            startTime: time,
            endTime: getEndTime(time),
            startRecur: med.startDate,
            endRecur: med.endDate || null,
            daysOfWeek: med.daysOfWeek || [0], 
            backgroundColor: getColorForMedication(med.id),
            extendedProps: { medication: med }
          });
        });
        break;
        
      default:
        
        med.timeOfDay.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const startDate = new Date(med.startDate);
          startDate.setHours(hours, minutes, 0);
          
          const endDate = new Date(startDate);
          endDate.setMinutes(endDate.getMinutes() + 30);
          
          events.push({
            id: `${med.id}-${time}`,
            title: `${med.name} ${med.dosage}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            backgroundColor: getColorForMedication(med.id),
            extendedProps: { medication: med }
          });
        });
    }
    
    return events;
  };
  
  
  const getEndTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + 30, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  
  const getColorForMedication = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };
  
  
  const handleEventClick = (info) => {
    const medicationId = info.event.extendedProps.medication.id;
    router.push(`/medications/${medicationId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Medication Calendar</h1>
      
      {}
      {events.length === 0 && (
        <div className="text-center py-4 bg-gray-50 rounded mb-4">
          <p>No medications scheduled. Add medications to see them on your calendar.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-12rem)]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={events}
          eventClick={handleEventClick}
          height="100%"
          nowIndicator={true}
          editable={false}
          selectable={true}
          dayMaxEvents={true}
        />
      </div>
    </div>
  );
}
