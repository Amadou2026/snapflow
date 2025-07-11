import sys
import io
import time
import traceback
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

# Forcer l'UTF-8 dans la console Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def log_form_errors(step_name=""):
    try:
        alert_box = driver.find_element(By.CLASS_NAME, "alert-danger")
    except NoSuchElementException:
        print(f"Aucune erreur détectée à l'étape {step_name}.", flush=True)
        return False

    error_messages = alert_box.find_elements(By.TAG_NAME, "li")
    if error_messages:
        print(f"\n❌ Non concluant à l'étape {step_name} :", flush=True)
        print("ERREURS_FORMULAIRES:", flush=True)
        for error in error_messages:
            print(f"- {error.text}", flush=True)
        return True

    print(f"Aucune erreur détectée à l'étape {step_name}.", flush=True)
    return False

def try_log_errors_on_exception():
    return log_form_errors("générale (lors d'une exception)")

options = webdriver.ChromeOptions()
options.add_argument("--disable-password-manager-collection")

driver = webdriver.Chrome(options=options)

try:
    driver.get("https://souscription.mae.tn/safertek/simulation/6/form")

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "destination[]")))
    Select(driver.find_element(By.NAME, "destination[]")).select_by_visible_text("AFGHANISTAN")

    today = datetime.now()
    date_depart = (today + timedelta(days=1)).strftime("%d/%m/%Y")
    date_retour = (today + timedelta(days=8)).strftime("%d/%m/%Y")

    date_range = driver.find_element(By.ID, "date_range")
    driver.execute_script("arguments[0].value = arguments[1];", date_range, f"{date_depart} - {date_retour}")
    date_range.send_keys("\t")
    time.sleep(1)

    birthday = driver.find_element(By.ID, "birthday")
    birthday.send_keys("15/05/1990")
    birthday.send_keys("\t")
    time.sleep(1)

    WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.NAME, "in_relation")))
    in_relation_checkbox = driver.find_element(By.NAME, "in_relation")
    if not in_relation_checkbox.is_selected():
        driver.execute_script("arguments[0].scrollIntoView();", in_relation_checkbox)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", in_relation_checkbox)

    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "with_child_container")))
    with_children_checkbox = driver.find_element(By.ID, "with_child")
    if not with_children_checkbox.is_selected():
        driver.execute_script("arguments[0].scrollIntoView();", with_children_checkbox)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", with_children_checkbox)

    driver.find_element(By.ID, "nb_child").send_keys("2")

    submit_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, "simulate-btn")))
    submit_button.click()
    time.sleep(3)
    if log_form_errors("Etape 1"):
        sys.exit(1)

    next_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, "next-step-btn")))
    next_button.click()
    time.sleep(3)
    if log_form_errors("Etape 2"):
        sys.exit(1)

    voyageurs = [
        {"name": "John Doe", "birthday": "01/01/1990", "cin_passport": "123456789"},
        {"name": "Jane Doe", "birthday": "02/02/1992", "cin_passport": "987654321"},
        {"name": "Alice Smith", "birthday": "03/03/2016", "cin_passport": "111223344"},
        {"name": "Bob Brown", "birthday": "04/04/2018", "cin_passport": "555666777"},
    ]

    for i, voyageur in enumerate(voyageurs, start=1):
        driver.find_element(By.NAME, f"name[{i}][]").send_keys(voyageur["name"])
        birthday_input = driver.find_element(By.NAME, f"birthday[{i}][]")
        birthday_input.send_keys(voyageur["birthday"])
        birthday_input.send_keys("\t")
        time.sleep(1)
        driver.find_element(By.NAME, f"cin_passport[{i}][]").send_keys(voyageur["cin_passport"])

    submit_second_step_button = WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CLASS_NAME, "btn_green")))
    driver.execute_script("arguments[0].scrollIntoView(true);", submit_second_step_button)
    submit_second_step_button.click()
    time.sleep(3)
    if log_form_errors("Etape 2 - validation voyageurs"):
        sys.exit(1)

    driver.get("https://souscription.mae.tn/safertek/personal-data/6/form")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "personal_data")))

    driver.find_element(By.XPATH, "//input[@value='M']").click()
    driver.find_element(By.XPATH, "//input[@value='m']").click()
    driver.find_element(By.NAME, "name").send_keys("John Doe")
    driver.find_element(By.XPATH, "//input[@value='cin']").click()
    driver.find_element(By.NAME, "cin").send_keys("25252525")
    driver.find_element(By.NAME, "identification_date").send_keys("01/01/2010")
    driver.find_element(By.NAME, "phone").send_keys("90120607")
    driver.find_element(By.NAME, "email").send_keys("johndoe@example.com")
    Select(driver.find_element(By.NAME, "governorate_id")).select_by_visible_text("Tunis")
    driver.find_element(By.NAME, "address").send_keys("123 rue Exemple")
    driver.find_element(By.NAME, "postal_code").send_keys("1000")

    confirm_button = driver.find_element(By.XPATH, "//button[@type='submit']")
    driver.execute_script("arguments[0].scrollIntoView(true);", confirm_button)
    confirm_button.click()
    time.sleep(3)
    if log_form_errors("Etape 3 - données personnelles"):
        sys.exit(1)

    # On ne cherche pas le bouton "Payer", on passe directement
    print("Fin du test sans cliquer sur le bouton 'Payer'.", flush=True)

    print("✅ Concluant", flush=True)
    sys.exit(0)

except Exception as e:
    if not try_log_errors_on_exception():
        print(f"Non concluant : {e}", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
    sys.exit(1)

finally:
    driver.quit()
