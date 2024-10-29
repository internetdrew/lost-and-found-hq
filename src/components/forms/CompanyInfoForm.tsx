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

interface CompanyInfoFormProps {
  setHasCompanyInfo: (hasCompanyInfo: boolean) => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter your company name' })
    .max(100, { message: 'Company name cannot exceed 100 characters' }),
  streetAddress: z
    .string()
    .min(1, { message: 'Please enter your company street address' })
    .max(200, { message: 'Street address cannot exceed 200 characters' }),
  city: z
    .string()
    .min(1, { message: 'Please enter your company city' })
    .max(50, { message: 'City name cannot exceed 50 characters' }),
  state: z.string().min(1, { message: 'Please enter your company state' }),
  zipCode: z
    .string()
    .length(5, { message: 'Zip code must be 5 digits' })
    .regex(/^\d{5}$/, { message: 'Zip code must be 5 numbers' }),
});

const CompanyInfoForm = ({ setHasCompanyInfo }: CompanyInfoFormProps) => {
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setUpdatingInfo(true);
    console.log(data);
    setTimeout(() => {
      setUpdatingInfo(false);
      setHasCompanyInfo(true);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-6 mt-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ACME Inc.'
                    disabled={updatingInfo}
                    {...field}
                  />
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
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='123 Main St.'
                    disabled={updatingInfo}
                    {...field}
                  />
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
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Gotham City'
                    disabled={updatingInfo}
                    {...field}
                  />
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
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={updatingInfo}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select state' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='font-mono'>
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
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
            <Button type='submit' disabled={updatingInfo}>
              {updatingInfo ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoForm;
