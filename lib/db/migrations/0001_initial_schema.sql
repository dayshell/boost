-- Create enums
CREATE TYPE "user_role" AS ENUM ('user', 'booster', 'admin');
CREATE TYPE "booster_status" AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE "order_status" AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE "transaction_type" AS ENUM ('deposit', 'withdrawal', 'order_payment', 'order_refund', 'booster_payout');
CREATE TYPE "transaction_status" AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create users table
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "role" "user_role" NOT NULL DEFAULT 'user',
  "balance" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  "avatar" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create boosters table
CREATE TABLE "boosters" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "telegram" TEXT NOT NULL,
  "games" JSONB NOT NULL,
  "experience" TEXT NOT NULL,
  "ranks" TEXT NOT NULL,
  "rate" DECIMAL(10, 2) NOT NULL,
  "about" TEXT,
  "other_profiles" TEXT,
  "status" "booster_status" NOT NULL DEFAULT 'pending',
  "total_orders" INTEGER NOT NULL DEFAULT 0,
  "rating" DECIMAL(3, 2) DEFAULT 0.00,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "booster_id" INTEGER REFERENCES "boosters"("id") ON DELETE SET NULL,
  "game" TEXT NOT NULL,
  "from_rank" TEXT NOT NULL,
  "to_rank" TEXT NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "status" "order_status" NOT NULL DEFAULT 'pending',
  "notes" TEXT,
  "started_at" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "booster_id" INTEGER NOT NULL REFERENCES "boosters"("id") ON DELETE CASCADE,
  "rating" SMALLINT NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
  "comment" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE "transactions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "amount" DECIMAL(10, 2) NOT NULL,
  "type" "transaction_type" NOT NULL,
  "status" "transaction_status" NOT NULL DEFAULT 'pending',
  "description" TEXT,
  "metadata" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_boosters_user_id" ON "boosters"("user_id");
CREATE INDEX "idx_boosters_status" ON "boosters"("status");
CREATE INDEX "idx_orders_user_id" ON "orders"("user_id");
CREATE INDEX "idx_orders_booster_id" ON "orders"("booster_id");
CREATE INDEX "idx_orders_status" ON "orders"("status");
CREATE INDEX "idx_reviews_order_id" ON "reviews"("order_id");
CREATE INDEX "idx_reviews_booster_id" ON "reviews"("booster_id");
CREATE INDEX "idx_transactions_user_id" ON "transactions"("user_id");
CREATE INDEX "idx_transactions_status" ON "transactions"("status");

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boosters_updated_at BEFORE UPDATE ON "boosters"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON "transactions"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
