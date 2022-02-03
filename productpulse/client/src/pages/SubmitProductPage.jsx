import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct } from '../api/products';
import { PRODUCT_CATEGORIES } from '../utils/categories';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const URL_PATTERN = /^https?:\/\/.+/i;

const SubmitProductPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { category: 'Other' } });

  const onSubmit = async (values) => {
    try {
      const product = await createProduct({
        ...values,
        imageUrl: values.imageUrl?.trim() || undefined,
      });
      toast.success('Launch published 🚀');
      navigate(`/launch/${product.id}`);
    } catch (err) {
      // Surface server field errors (express-validator) onto the right inputs.
      if (Array.isArray(err.errors) && err.errors.length) {
        err.errors.forEach((e) => {
          if (e.param) setError(e.param, { type: 'server', message: e.msg });
        });
      } else {
        toast.error(err.message || 'Could not publish launch');
      }
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink-900">
        Submit a launch
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Share something you built. You&apos;ll auto-upvote your own launch.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="Product name"
          placeholder="e.g. Quill AI"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 80, message: 'Name must be at most 80 characters' },
          })}
        />

        <Input
          label="Tagline"
          placeholder="One punchy line about what it does"
          error={errors.tagline?.message}
          {...register('tagline', {
            required: 'Tagline is required',
            maxLength: {
              value: 120,
              message: 'Tagline must be at most 120 characters',
            },
          })}
        />

        <Input
          label="Website URL"
          placeholder="https://…"
          error={errors.url?.message}
          {...register('url', {
            required: 'A website URL is required',
            pattern: {
              value: URL_PATTERN,
              message: 'URL must start with http:// or https://',
            },
          })}
        />

        <Input
          label="Image URL"
          hint="Optional — we'll generate a thumbnail if you leave this blank."
          placeholder="https://… (optional)"
          error={errors.imageUrl?.message}
          {...register('imageUrl', {
            validate: (v) =>
              !v || URL_PATTERN.test(v) || 'Image URL must start with http:// or https://',
          })}
        />

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400"
            {...register('category')}
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Description"
          rows={5}
          placeholder="What is it, who is it for, and what makes it good?"
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
            maxLength: {
              value: 2000,
              message: 'Description must be at most 2000 characters',
            },
          })}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>
            Publish launch
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitProductPage;
