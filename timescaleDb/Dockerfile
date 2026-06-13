
FROM timescale/timescaledb:latest-pg17

# ENV POSTGRES_USER=postgres
# ENV POSTGRES_PASSWORD=mysecret
# ENV POSTGRES_DB=mydb

COPY ./init-scripts /docker-entrypoint-initdb.d/

EXPOSE 5432
