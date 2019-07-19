--
-- PostgreSQL database dump
--

-- Dumped from database version 11.0
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: postcodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.postcodes (
    id character varying(8) NOT NULL,
    postcode character varying(10),
    latitude double precision,
    longitude double precision
);


--
-- Name: postcodes postcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postcodes
    ADD CONSTRAINT postcodes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

