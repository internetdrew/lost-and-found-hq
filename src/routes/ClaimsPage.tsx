import { Skeleton } from '@/components/ui/skeleton';
import { useLocations } from '@/hooks/useData';
import { useState } from 'react';

const conversations = [
  {
    id: 1,
    name: 'Chat 1',
  },
  {
    id: 2,
    name: 'Chat 2',
  },
  {
    id: 3,
    name: 'Chat 3',
  },
  {
    id: 4,
    name: 'Chat 4',
  },
  {
    id: 5,
    name: 'Chat 5',
  },
  {
    id: 6,
    name: 'Chat 6',
  },
  {
    id: 7,
    name: 'Chat 7',
  },
  {
    id: 8,
    name: 'Chat 8',
  },
  {
    id: 9,
    name: 'Chat 9',
  },
  {
    id: 10,
    name: 'Chat 10',
  },
  {
    id: 11,
    name: 'Chat 11',
  },
  {
    id: 12,
    name: 'Chat 12',
  },
  {
    id: 13,
    name: 'Chat 13',
  },
  {
    id: 14,
    name: 'Chat 14',
  },
];

const ClaimsPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    (typeof conversations)[number] | null
  >(null);
  const { locations, isLoading: fetchingLocations } = useLocations();
  const defaultLocation = locations?.[0];

  return (
    <div className='p-4 sm:px-8'>
      <section className='p-4 rounded-md ring-1 ring-neutral-200 max-w-5xl mx-auto shadow-md'>
        {fetchingLocations ? (
          <Skeleton className='w-1/4 h-8' />
        ) : (
          <h1 className='text-lg font-semibold'>
            Claims at {defaultLocation?.name}
          </h1>
        )}
        <p className='text-sm text-neutral-500'>
          Here you can view all the claims for your location.
        </p>
      </section>

      <section className='mt-10 ring-1 ring-neutral-200 rounded-md  max-w-5xl mx-auto shadow-md'>
        <h2 className='text-sm font-medium py-2 px-4 border-b border-neutral-200'>
          Conversations
        </h2>
        <div className='flex h-full min-h-[400px] max-h-[400px]'>
          <ul className='flex flex-col gap-2 w-1/3 border-r border-neutral-200 p-2 overflow-y-auto overflow-hidden'>
            {conversations.map(conversation => (
              <li
                key={conversation.id}
                className={`cursor-pointer ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-pink-700/10'
                    : ''
                } hover:shadow-md rounded-md p-2 transition-all duration-300`}
                onClick={() => setSelectedConversation(conversation)}
              >
                {conversation.name}
              </li>
            ))}
          </ul>
          <section className='w-2/3 overflow-y-auto overflow-hidden bg-pink-100/10'>
            {selectedConversation?.name}
          </section>
        </div>
      </section>
    </div>
  );
};

export default ClaimsPage;
