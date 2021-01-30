package com.example.changekeeper;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class SettingsScreen extends AppCompatActivity implements DeleteAllDialog.DeleteAllDialogListener, SetWallet.SetWalletListener,SetCard.SetWalletListener, ConfirmDialogueSet.ConfirmDialogueSetListener, ConfirmDialogueSet2.ConfirmDialogueSetListener2{
    private static final String TAG = ":(";
    public static final String EXTRA_MESSAGE = "com.example.CategoryScreen.MESSAGE";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar toolbar = getSupportActionBar();
        toolbar = getSupportActionBar();
        toolbar.setTitle("Settings");


        Intent intent = getIntent();
        setContentView(R.layout.activity_settings);

        ToggleButton toggle = (ToggleButton) findViewById(R.id.toggleButton);
        toggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    toggle.setBackgroundDrawable(getDrawable(R.drawable.pill_button_toggle_on));
                    toggle.setTextColor(Color.parseColor("#2ecc71"));
                } else {
                    toggle.setBackgroundDrawable(getDrawable(R.drawable.pill_button_cancel));
                    toggle.setTextColor(Color.parseColor("#ecf0f1"));
                }
            }
        });

        LinearLayout tutorial = (LinearLayout) findViewById(R.id.ll2);

        tutorial.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i("Fds","oiboiasf");
                startActivity(new Intent(view.getContext(), IntroActivity.class));
            }
        });

        LinearLayout setWallet = (LinearLayout) findViewById(R.id.ll3);

        setWallet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i("Fds","oiboiasf");
                SetWallet setWallet = SetWallet.newInstance();
                setWallet.show(getSupportFragmentManager(), "Set Wallet");
            }
        });

        LinearLayout setCard = (LinearLayout) findViewById(R.id.ll4);

        setCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i("Fds","oiboiasf");
                SetCard setCard = SetCard.newInstance();
                setCard.show(getSupportFragmentManager(), "Set Card");
            }
        });

        Button del = findViewById(R.id.canc2);

        del.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i("Fds","oiboiasf");
                DeleteAllDialog delDialog = DeleteAllDialog.newInstance();
                delDialog.show(getSupportFragmentManager(), "Delete");
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
        }
        return true;
    }


    @Override
    public void updateTransfer(String value) {

    }

    @Override
    public void confirm1(String amount) {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount;
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());



            inputStreamReader.close();
            fileInputStream.close();

            amount = amount.replace("€","");
            Toast toast;

            walletAmount = Double.parseDouble(amount);
            toast = Toast.makeText(this,"Wallet money manually set!", Toast.LENGTH_LONG);
            toast.show();

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();




        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        startActivity(new Intent(this, MainActivity.class));

    }

    @Override
    public void confirm2(String amount) {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount;



            inputStreamReader.close();
            fileInputStream.close();

            amount = amount.replace("€","");
            Toast toast;

            cardAmount = Double.parseDouble(amount);
            toast = Toast.makeText(this,"Card money manually set!", Toast.LENGTH_LONG);
            toast.show();

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();




        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        startActivity(new Intent(this, MainActivity.class));

    }

    @Override
    public void confirm() {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount;



            inputStreamReader.close();

            cardAmount = 0.0;
            walletAmount = 0.0;

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();

        }catch (Exception e){

        }
        try {
            FileOutputStream fileOutputStream = openFileOutput("UserBorrows.txt", MODE_PRIVATE);
            fileOutputStream.write(("").getBytes());

        }catch (Exception e){

        }

        try {
            FileOutputStream fileOutputStream = openFileOutput("UserLends.txt", MODE_PRIVATE);
            fileOutputStream.write(("").getBytes());

        }catch (Exception e){

        }
        try {
            FileOutputStream fileOutputStream = openFileOutput("UserIncomes.txt", MODE_PRIVATE);
            fileOutputStream.write(("").getBytes());

        }catch (Exception e){

        }
        try {
            FileOutputStream fileOutputStream = openFileOutput("UserExpenses.txt", MODE_PRIVATE);
            fileOutputStream.write(("").getBytes());

        }catch (Exception e){

        }
        try {
            FileOutputStream fileOutputStream = openFileOutput("UserCategories.txt", MODE_PRIVATE);
            fileOutputStream.write(("").getBytes());

        }catch (Exception e){

        }

        Toast toast;

        toast = Toast.makeText(this,"All info deleted successfully!", Toast.LENGTH_LONG);
        toast.show();

        startActivity(new Intent(this, MainActivity.class));

    }
}
