import os
import re

with open('views.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

imports = []
functions = {}
current_func = None
func_lines = []

for line in lines:
    if line.startswith('def ') or line.startswith('@login_required'):
        # If line is decorator, we need to handle it. Actually, a decorator is before `def `.
        # Let's adjust to collect decorators with the function.
        pass

# Better approach: parse line by line. A new function block starts with `@` (if followed by `def`) or `def `.
# Since there are decorators like `@login_required`, let's track state.
# Let's just use Python's AST to get the lines of each function.
import ast

with open('views.py', 'r', encoding='utf-8') as f:
    source = f.read()

tree = ast.parse(source)
functions = {}
imports_source = ""

for node in tree.body:
    if isinstance(node, ast.FunctionDef):
        # We need the source lines of this function, including decorators
        start_lineno = node.decorator_list[0].lineno if node.decorator_list else node.lineno
        end_lineno = node.end_lineno
        functions[node.name] = "\n".join(source.splitlines()[start_lineno-1:end_lineno]) + "\n\n"
    elif isinstance(node, (ast.Import, ast.ImportFrom, ast.Assign)):
        start_lineno = node.lineno
        end_lineno = node.end_lineno
        imports_source += "\n".join(source.splitlines()[start_lineno-1:end_lineno]) + "\n"

groups = {
    'auth.py': ['login_view', 'register_citoyen_view', 'logout_view'],
    'contraventions.py': ['dashboard_view', 'contravention_create_view', 'contravention_detail_view', 'valider_contravention_view', 'rejeter_contravention_view', 'payer_contravention_view', 'verifier_pv_view', 'contravention_pdf_view', 'contester_contravention_view', 'api_contraventions_geoloc', '_verifier_acces_contravention'],
    'infractions.py': ['infractions_list_view', 'infraction_toggle_view', 'infraction_edit_view', 'infraction_delete_view', 'code_route_view'],
    'utilisateurs.py': ['agents_list_view', 'agent_toggle_view', 'agent_edit_view', 'agent_delete_view', 'registre_nina_list_view', 'api_recherche_nina'],
    'litiges.py': ['litiges_list_view', 'traiter_litige_view'],
    'statistiques.py': ['statistiques_view', 'export_contraventions_csv'],
    'notifications.py': ['notifications_list_view']
}

os.makedirs('views', exist_ok=True)
for filename, funcs in groups.items():
    with open(f'views/{filename}', 'w', encoding='utf-8') as f:
        f.write(imports_source + "\n\n")
        for func in funcs:
            if func in functions:
                f.write(functions[func])

# Create __init__.py
with open('views/__init__.py', 'w', encoding='utf-8') as f:
    for filename in groups.keys():
        mod_name = filename.replace('.py', '')
        f.write(f"from .{mod_name} import *\n")

print("Splitting complete.")
