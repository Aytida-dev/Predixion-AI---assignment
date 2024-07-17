# Frontend

## setup

```bash
npm install
```

> populate the .env using .env.sample

## build

```bash
npm run build
```

## start

```bash
npm run preview
```

### frontend will be running on http://localhost:5173

# Backend

## Start the venv

```bash
python3 -m venv venv
source venv/bin/activate
```

### On windows

```bash
python -m venv venv
venv\Scripts\activate
```

## Install the requirements

```bash
pip install -r requirements.txt
```

> populate the .env using .env.sample

## Run the server

```bash
uvicorn main:app --reload
```

### backend will be running on http://localhost:8000
