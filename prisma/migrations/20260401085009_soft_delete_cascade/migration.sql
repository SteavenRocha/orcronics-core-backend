-- Funciones de cascada

CREATE OR REPLACE FUNCTION soft_delete_customer_cascade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE branches 
  SET deleted_at = NEW.deleted_at,
      updated_at = NEW.updated_at
  WHERE customer_id = NEW.id AND deleted_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete_branch_cascade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE areas 
  SET deleted_at = NEW.deleted_at,
      updated_at = NEW.updated_at
  WHERE branch_id = NEW.id AND deleted_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete_area_cascade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE devices 
  SET deleted_at = NEW.deleted_at,
      updated_at = NEW.updated_at
  WHERE area_id = NEW.id AND deleted_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete_device_cascade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE device_metadata 
  SET deleted_at = NEW.deleted_at,
      updated_at = NEW.updated_at
  WHERE device_id = NEW.id AND deleted_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers

CREATE TRIGGER trg_soft_delete_customer
AFTER UPDATE OF deleted_at ON customers
FOR EACH ROW
WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
EXECUTE FUNCTION soft_delete_customer_cascade();

CREATE TRIGGER trg_soft_delete_branch
AFTER UPDATE OF deleted_at ON branches
FOR EACH ROW
WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
EXECUTE FUNCTION soft_delete_branch_cascade();

CREATE TRIGGER trg_soft_delete_area
AFTER UPDATE OF deleted_at ON areas
FOR EACH ROW
WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
EXECUTE FUNCTION soft_delete_area_cascade();

CREATE TRIGGER trg_soft_delete_device
AFTER UPDATE OF deleted_at ON devices
FOR EACH ROW
WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
EXECUTE FUNCTION soft_delete_device_cascade();