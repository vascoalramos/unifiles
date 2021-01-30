package com.example.changekeeper;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;

public class SubscriptionScreen extends AppCompatActivity implements SearchDialog2.SearchDialogListener2 {
    private static final String TAG = "AllowanceScreen";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar toolbar = getSupportActionBar();
        toolbar = getSupportActionBar();
        toolbar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
        toolbar.setCustomView(R.layout.layout_actionbar);
        ((TextView)toolbar.getCustomView().findViewById(R.id.ourTitle)).setText("My Subscriptions");

        ImageButton butt  = toolbar.getCustomView().findViewById(R.id.settings);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                Intent intent = new Intent(v.getContext(), SettingsScreen.class);
                startActivity(intent);
            }
        });

        Intent intent = getIntent();

        setContentView(R.layout.activity_subscriptions);

        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setSelectedItemId(R.id.navigation_subscriptions);
        navigation.setOnNavigationItemSelectedListener((item) -> {
            switch (item.getItemId()) {
                case R.id.navigation_subscriptions:
                    return true;
                case R.id.navigation_allowances:
                    startActivity(new Intent(this, AllowanceScreen.class));
                    return true;
                case R.id.navigation_home:
                    startActivity(new Intent(this, MainActivity.class));
                    return true;
                case R.id.navigation_loans:
                    startActivity(new Intent(this, LoanScreen.class));
                    return true;
                case R.id.navigation_info:
                    startActivity(new Intent(this, GraphsScreen.class));
                    return true;
            }
            return false;
        });
    }


    @Override
    public void search(String date, String desc) {
        SubscriptionInfoFragment fragment = (SubscriptionInfoFragment) getSupportFragmentManager().findFragmentById(R.id.info);
        fragment.search(date,desc);
    }

    @Override
    public void noUpdate() {

    }
}
