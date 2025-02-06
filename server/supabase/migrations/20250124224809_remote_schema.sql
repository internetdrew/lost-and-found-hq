alter table "public"."subscriptions" drop constraint "subscriptions_stripe_subscription_id_key";

drop index if exists "public"."subscriptions_stripe_subscription_id_key";


