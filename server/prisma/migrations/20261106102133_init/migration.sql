-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'host',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscription_tier" TEXT NOT NULL DEFAULT 'free',
    "subscription_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "theme_id" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "tagline" TEXT,
    "welcome_message" TEXT,
    "story_content" TEXT,
    "family_info" TEXT,
    "music_url" TEXT,
    "hero_image_url" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "allow_language_toggle" BOOLEAN NOT NULL DEFAULT true,
    "allow_guest_rsvp_edit" BOOLEAN NOT NULL DEFAULT true,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "invitation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event_date" DATE NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "venue_name" TEXT,
    "venue_address" TEXT,
    "venue_city" TEXT,
    "venue_state" TEXT,
    "venue_country" TEXT NOT NULL DEFAULT 'India',
    "map_latitude" DECIMAL(10,8),
    "map_longitude" DECIMAL(11,8),
    "map_link" TEXT,
    "dress_code" TEXT,
    "dress_code_description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_main_event" BOOLEAN NOT NULL DEFAULT false,
    "show_countdown" BOOLEAN NOT NULL DEFAULT false,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "invitation_id" TEXT NOT NULL,
    "household_name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "max_guests" INTEGER NOT NULL DEFAULT 1,
    "allowed_events" TEXT[],
    "email" TEXT,
    "phone" TEXT,
    "link_opened_at" TIMESTAMP(3),
    "link_open_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_members" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "age_group" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "is_attending" BOOLEAN NOT NULL,
    "attending_count" INTEGER NOT NULL DEFAULT 0,
    "events_attending" TEXT[],
    "dietary_restrictions" TEXT,
    "special_requests" TEXT,
    "message" TEXT,
    "responded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "invitation_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_filename" TEXT,
    "url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "caption" TEXT,
    "alt_text" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "event_id" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "template_component" TEXT NOT NULL,
    "preview_image_url" TEXT,
    "preview_url" TEXT,
    "default_colors" JSONB,
    "default_fonts" JSONB,
    "features" TEXT[],
    "price_tier" TEXT NOT NULL DEFAULT 'free',
    "price_amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "billing_cycle" TEXT,
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "stripe_subscription_id" TEXT,
    "stripe_customer_id" TEXT,
    "razorpay_subscription_id" TEXT,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "payment_method" TEXT,
    "gateway" TEXT,
    "gateway_transaction_id" TEXT,
    "gateway_payment_intent_id" TEXT,
    "purpose" TEXT NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "succeeded_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "theme_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "price_paid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "theme_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "admin_user_id" TEXT,
    "actor_type" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_slug_key" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_user_id_idx" ON "invitations"("user_id");

-- CreateIndex
CREATE INDEX "invitations_slug_idx" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_event_type_idx" ON "invitations"("event_type");

-- CreateIndex
CREATE INDEX "invitations_is_live_idx" ON "invitations"("is_live");

-- CreateIndex
CREATE INDEX "events_invitation_id_idx" ON "events"("invitation_id");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "events_invitation_id_order_index_idx" ON "events"("invitation_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "guests_token_key" ON "guests"("token");

-- CreateIndex
CREATE INDEX "guests_invitation_id_idx" ON "guests"("invitation_id");

-- CreateIndex
CREATE INDEX "guests_token_idx" ON "guests"("token");

-- CreateIndex
CREATE INDEX "guests_invitation_id_household_name_idx" ON "guests"("invitation_id", "household_name");

-- CreateIndex
CREATE INDEX "guest_members_guest_id_idx" ON "guest_members"("guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "rsvps_guest_id_key" ON "rsvps"("guest_id");

-- CreateIndex
CREATE INDEX "rsvps_guest_id_idx" ON "rsvps"("guest_id");

-- CreateIndex
CREATE INDEX "rsvps_responded_at_idx" ON "rsvps"("responded_at");

-- CreateIndex
CREATE INDEX "rsvps_is_attending_idx" ON "rsvps"("is_attending");

-- CreateIndex
CREATE INDEX "media_assets_invitation_id_idx" ON "media_assets"("invitation_id");

-- CreateIndex
CREATE INDEX "media_assets_type_idx" ON "media_assets"("type");

-- CreateIndex
CREATE INDEX "media_assets_invitation_id_order_index_idx" ON "media_assets"("invitation_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "themes"("slug");

-- CreateIndex
CREATE INDEX "themes_category_idx" ON "themes"("category");

-- CreateIndex
CREATE INDEX "themes_price_tier_idx" ON "themes"("price_tier");

-- CreateIndex
CREATE INDEX "themes_is_active_idx" ON "themes"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_gateway_transaction_id_idx" ON "payments"("gateway_transaction_id");

-- CreateIndex
CREATE INDEX "theme_purchases_user_id_idx" ON "theme_purchases"("user_id");

-- CreateIndex
CREATE INDEX "theme_purchases_theme_id_idx" ON "theme_purchases"("theme_id");

-- CreateIndex
CREATE UNIQUE INDEX "theme_purchases_user_id_theme_id_key" ON "theme_purchases"("user_id", "theme_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_members" ADD CONSTRAINT "guest_members_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_purchases" ADD CONSTRAINT "theme_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_purchases" ADD CONSTRAINT "theme_purchases_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
