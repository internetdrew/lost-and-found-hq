import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { US_STATES } from '@/constants';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Tables } from '@dbTypes';
import { useLocations } from '@/hooks/useLocations';
import { INPUT_LENGTHS } from '@/constants';

type LocationInfoFormProps = {
  location: Tables<'locations'> | null;
  onSuccess: () => void;
};

const formSchema = z.object({
  name: z
    .string()
    .min(INPUT_LENGTHS.location.name.min, {
      message: 'Please enter your company name',
    })
    .max(INPUT_LENGTHS.location.name.max, {
      message: `Company name cannot exceed ${INPUT_LENGTHS.location.name.max} characters`,
    }),
  streetAddress: z
    .string()
    .min(INPUT_LENGTHS.location.streetAddress.min, {
      message: 'Please enter your company street address',
    })
    .max(INPUT_LENGTHS.location.streetAddress.max, {
      message: `Street address cannot exceed ${INPUT_LENGTHS.location.streetAddress.max} characters`,
    }),
  city: z
    .string()
    .min(INPUT_LENGTHS.location.city.min, {
      message: 'Please enter your company city',
    })
    .max(INPUT_LENGTHS.location.city.max, {
      message: `City name cannot exceed ${INPUT_LENGTHS.location.city.max} characters`,
    }),
  state: z.string().min(1, { message: 'Please enter your company state' }),
  zipCode: z
    .string()
    .length(5, { message: 'Zip code must be 5 digits' })
    .regex(/^\d{5}$/, { message: 'Zip code must be 5 numbers' }),
});

const LocationInfoForm = ({
  location,
  onSuccess: closeLocationFormDialog,
}: LocationInfoFormProps) => {
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const { mutate } = useLocations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location?.name || '',
      streetAddress: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      zipCode: location?.postal_code || '',
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setUpdatingInfo(true);
    const method = location ? 'patch' : 'post';
    const endpoint = location
      ? `/api/v1/locations/${location?.id}`
      : `/api/v1/locations`;

    try {
      await axios[method](endpoint, {
        ...formData,
        id: location?.id,
      });
      mutate();
      closeLocationFormDialog();
      toast.success('Location info updated successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update location info.');
    } finally {
      setUpdatingInfo(false);
    }
  };

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-6 mt-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='company-name'>Company Name</FormLabel>
                <FormControl>
                  <>
                    <Input
                      id='company-name'
                      placeholder='ACME Inc.'
                      disabled={updatingInfo}
                      maxLength={INPUT_LENGTHS.location.name.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.location.name.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='streetAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='street-address'>Street Address</FormLabel>
                <FormControl>
                  <>
                    <Input
                      id='street-address'
                      placeholder='123 Main St.'
                      disabled={updatingInfo}
                      maxLength={INPUT_LENGTHS.location.streetAddress.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.location.streetAddress.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='city'>City</FormLabel>
                <FormControl>
                  <>
                    <Input
                      id='city'
                      placeholder='Gotham City'
                      disabled={updatingInfo}
                      maxLength={INPUT_LENGTHS.location.city.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.location.city.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel htmlFor='state'>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={updatingInfo}
                  >
                    <FormControl>
                      <SelectTrigger id='state'>
                        <SelectValue placeholder='Select state' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='zipCode'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel htmlFor='zip-code'>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      id='zip-code'
                      disabled={updatingInfo}
                      placeholder='12345'
                      maxLength={5}
                      inputMode='numeric'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={updatingInfo || !isDirty || !isValid}
            >
              {location ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LocationInfoForm;
