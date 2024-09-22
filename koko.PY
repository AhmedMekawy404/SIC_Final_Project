import tkinter as tk
from tkinter import ttk
import serial

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)  # Adjust the port name if necessary

# Send the command to the serial device
def send_command(command):
    ser.write(command.encode())

def stop_command(event=None):
    send_command("S")  # Stop when key is released

# Define movement functions
def move_up(event=None):
    send_command("F")

def move_down(event=None):
    send_command("B")

def move_left(event=None):
    send_command("L")

def move_right(event=None):
    send_command("R")

# Create the main window
root = tk.Tk()
root.title("D-pad Example")

# Create a style for ttk buttons
style = ttk.Style()
style.configure("TButton", font=("Helvetica", 16), padding=10)

# Create D-pad buttons using ttk for a better look
up_button = ttk.Button(root, text="W")
down_button = ttk.Button(root, text="S")
left_button = ttk.Button(root, text="A")
right_button = ttk.Button(root, text="D")

# Bind the buttons to commands on press and stop on release
up_button.bind('<ButtonPress-1>', move_up)
up_button.bind('<ButtonRelease-1>', stop_command)
down_button.bind('<ButtonPress-1>', move_down)
down_button.bind('<ButtonRelease-1>', stop_command)
left_button.bind('<ButtonPress-1>', move_left)
left_button.bind('<ButtonRelease-1>', stop_command)
right_button.bind('<ButtonPress-1>', move_right)
right_button.bind('<ButtonRelease-1>', stop_command)

# Bind keyboard keys (WASD) to the movement functions
root.bind('<w>', move_up)      # W for forward
root.bind('<s>', move_down)    # S for backward
root.bind('<a>', move_left)    # A for left
root.bind('<d>', move_right)   # D for right

# Bind the key release event to stop movement
root.bind('<KeyRelease>', stop_command)

# Arrange buttons in a grid
up_button.grid(row=0, column=1, padx=20, pady=20)
left_button.grid(row=1, column=0, padx=20, pady=20)
right_button.grid(row=1, column=2, padx=20, pady=20)
down_button.grid(row=2, column=1, padx=20, pady=20)

# Start the Tkinter event loop
root.mainloop()
